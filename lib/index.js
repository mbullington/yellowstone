const net = require("net");
const urlParse = require("url");
const { EventEmitter } = require("events");

const { parseRTPPacket, parseRTCPPacket, getMD5Hash, parseTransport } = require('./util.js');

const transform = require("sdp-transform");

const WWW_AUTH_REGEX = new RegExp('([a-z]+)=\'([^,\s]+)\'');

const readStates = {Searching: 0,
                    ReadingRTSPHeader: 1,
                    ReadingRTSPPayload: 2,
                    ReadingRawPacketSize: 3,
                    ReadingRawPacket: 4};

class RtspClient extends EventEmitter {
  constructor(username, password, headers) {
    super();

    this.isConnected = false;

    // internal variables
    this._client = null;
    this._cSeq = 0;
    this._unsupportedExtensions = null;
    this._session = null;

    this.username = username;
    this.password = password;

    this.readState = readStates.Searching;

    this.rtspMessage = []; // RTSP Message
    this.rtspContentLength = 0; // From Content-Length: in the RTSP message
    this.rtspStatusLine = "";
    this.rtspHeaders = [];
    this.rtspContent = [];

    this.rtspPacketLength = 0;
    this.rtspPacket;
    this.rtspPacketPointer = 0;

    this.headers = Object.assign({ "User-Agent": "yellowstone/2.0.0" },
        headers || {});
  }

  _onData(data) {

    let index = 0;

    while (index < data.length) {

      if (this.readState == readStates.Searching && data[index] == 0x24) { // $
          // found the start of a RTP or RTCP block of data
          this.rtspMessage = [];
          this.rtspMessage.push(data[index]);
          index++;
          this.readState = readStates.ReadingRawPacketSize;
      } else if (this.readState == readStates.Searching && data[index] == 0x52) { // 'R'
          // found the start of a RTSP rtsp_message
          this.rtspMessage = [];
          this.rtspMessage.push(data[index]);
          index++;
          this.readState = readStates.ReadingRTSPHeader;
      } else if (this.readState == readStates.ReadingRTSPHeader) {
        // Reading a RTSP message.
        
        // Add character to the rtspMessage
        // Ignore /r (13) but keep /n (10)
        if (data[index] != 13) { // \r
          this.rtspMessage.push(data[index]);
        }
        index++;

        // If we have two new lines back to back then we have a complete RTSP command
        // Note we may still need to read the Content Payload (the body) e.g. the SDP
        if (this.rtspMessage.length >= 2
          && this.rtspMessage[this.rtspMessage.length-2] == 10
          && this.rtspMessage[this.rtspMessage.length-1] == 10) {

          // Parse the Header
          this.rtspContentLength = 0;

          const ascii_text = String.fromCharCode.apply(null,this.rtspMessage);
          const lines = ascii_text.split("\n");
          this.rtspStatusLine = lines[0];

          this.rtspHeaders = {};

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            const indexOf = line.indexOf(":");

            if (indexOf !== line.length - 1) {
              const key = line.substring(0, indexOf).trim();
              const data = line.substring(indexOf + 1).trim();
              this.rtspHeaders[key] = data.match(/^[0-9]+$/) ? parseInt(data, 10) : data;

              if (key == 'Content-Length') {
                this.rtspContentLength = parseInt(data,10);
              }
            }
          }

          if (this.rtspContentLength == 0) {
            // We can Emit the RTSP message
            this.emit("log", data, "S->C");
            this.emit("response", this.rtspStatusLine, this.rtspHeaders, []);
            this.readState = readStates.Searching;
          } else {
            this.rtspContent = [];
            this.readState = readStates.ReadingRTSPPayload;
          }
        }
      } else if (this.readState == readStates.ReadingRTSPPayload
        && this.rtspContent.length < this.rtspContentLength) {
        // Copy data into the RTSP payload
        this.rtspContent.push(data[index]);
        index++;

        if (this.rtspContent.length == this.rtspContentLength) {
          const ascii_text = String.fromCharCode.apply(null,this.rtspContent);
          const mediaHeaders = ascii_text.split("\n");

          // Emit the RTSP message
          this.emit("log", data, "S->C");
          this.emit("response", this.rtspStatusLine, this.rtspHeaders, mediaHeaders);
          this.readState = readStates.Searching;
        }
      } else if (this.readState == readStates.ReadingRawPacketSize) {
        // accumulate bytes for $, channel and length
        this.rtspMessage.push(data[index]);
        index++;

        if (this.rtspMessage.length == 4) {
          this.rtspPacketLength = (this.rtspMessage[2] << 8) + this.rtspMessage[3];
          if (this.rtspPacketLength > 0) {
            this.rtspPacket = new Buffer(this.rtspPacketLength);
            this.rtspPacketPointer = 0;
            this.readState = readStates.ReadingRawPacket;
          } else {
            this.readState = readStates.Searching;
          }
        }
      } else if (this.readState == readStates.ReadingRawPacket) {
        this.rtspPacket[this.rtspPacketPointer++] = data[index];
        index++;

        if (this.rtspPacketPointer == this.rtspPacketLength) {
          const packetChannel = this.rtspMessage[1];
          if (packetChannel === 0) {
            const packet = parseRTPPacket(this.rtspPacket);
            this.emit("data", packetChannel, packet.payload, packet);
          }
          if (packetChannel === 1) {
            const packet = parseRTCPPacket(this.rtspPacket);
            this.emit("controlData", packetChannel, packet);
          }
          this.readState = readStates.Searching;
        }
      } else {
        // unexpected data
        throw new Error("Bug in RTSP data framing, please file an issue with the author with stacktrace.");
      }
    } // end while
  }

  connect(url) {
    const { hostname, port } = urlParse.parse((this._url = url));
    // mutable
    let format = "";
    let mediaSource = ""; // part of SDP

    return new Promise((resolve, reject) => {
      // set later, mutable
      let client;

      const errorListener = err => {
        client.removeListener("error", errorListener);
        reject(err);
      };

      const closeListener = () => {
        client.removeListener("close", closeListener);
        this.close(true);
      };

      const responseListener = (responseName, headers) => {
        const name = responseName.split(" ")[0];
        if (name.indexOf("RTSP/") === 0) {
          return;
        }

        // TODO: Send back errors... for some reason?
        if (name === "REDIRECT" || name === "ANNOUNCE") {
          this.respond("200 OK", { CSeq: headers.CSeq });
        }

        if (name === "REDIRECT") {
          this.close();
          this.connect(headers.Location);
        }
      };

      client = net.connect(port || 554, hostname, () => {
        this.isConnected = true;
        this._client = client;

        client.removeListener("error", errorListener);

        this.on("response", responseListener);
        resolve(this);
      });

      client.on("data", this._onData.bind(this));
      client.on("error", errorListener);
      client.on("close", closeListener);
//    }).then(_ => {
//      return this.request("OPTIONS");
    }).then(_ => {
      return this.request("DESCRIBE", { Accept: "application/sdp" });
    }).then(obj => {
      const sdp = transform.parse(obj.mediaHeaders.join("\r\n"));

      sdp.media.forEach(media => {
        if (media.type === "video" && media.protocol === "RTP/AVP") {
          mediaSource = media;
        }
      });

      if (!mediaSource) {
        throw new Error("Only video sources using the RTP/AVP protocol are supported at this time.");
      }

      if (mediaSource.control) {
        this._url += `/${mediaSource.control}`;
      }

      mediaSource.rtp.forEach(obj => {
        if (format.length > 0) {
          return;
        }

        if (obj.codec) {
          format = obj.codec;
        }
      })

      return this.request("SETUP", { Transport: "RTP/AVP/TCP;interleaved=0-1" }); // Channel 0 = RTP. Channel 1 = RTCP
    }).then(headers => {
      if (headers.Transport.split(';')[0] !== "RTP/AVP/TCP") {
        throw new Error("Only RTSP servers supporting RTP/AVP over TCP are supported at this time.");
      }

      if (headers.Unsupported) {
        this._unsupportedExtensions = headers.Unsupported.split(',');
      }

      const transport = parseTransport(headers.Transport);
      this._session = headers.Session;

      return {
        format,
        mediaSource,
        transport
      };
    });
  }

  request(requestName, headers, url) {
    headers = headers || {};

    const id = ++this._cSeq;
    // mutable via string addition
    let req = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;

    Object.assign(headers, this.headers);

    Object.keys(headers).forEach((header, index) => {
      req += `${header}: ${headers[header].toString()}\r\n`;
    });

    this.emit("log", req, "C->S");
    this._client.write(req + '\r\n');

    return new Promise((resolve, reject) => {
      const responseHandler = (responseName, headers, mediaHeaders) => {
        if(headers.CSeq !== id && headers.Cseq !== id) {
          return;
        }

        const statusCode = parseInt(responseName.split(' ')[1]);

        if (statusCode === 200) {
          if (mediaHeaders.length > 0) {
            resolve({ headers, mediaHeaders });
          } else {
            resolve(headers);
          }
        } else {
          // non-200 status code
          if (statusCode === 401) {
            const type = headers["WWW-Authenticate"].split(" ")[0];
            const authHeaders = {};

            const match = WWW_AUTH_REGEX.exec(headers["WWW-Authenticate"]);
            while (match) {
              authHeaders[match[0]] = match[1];
              match = WWW_AUTH_REGEX.exec(headers["WWW-Authenticate"]);
            }

            // mutable, but only assigned to by if block
            let authString = "";
            if (type === "Digest") {
              // Digest Authentication
              const ha1 = getMD5Hash(`${this.username}:${authHeaders.realm}:${this.password}`);
              const ha2 = getMD5Hash(`${requestName}:${this._url}`);
              const ha3 = getMD5Hash(`${ha1}:${authHeaders.nonce}:${ha2}`);

              authString = `Digest username="${this.username}",realm="${authHeaders.realm}",nonce="${authHeaders.nonce}",uri="${this._url}",response="${ha3}"`;
            } else if (type === "Basic") {
              // Basic Authentication
              // https://xkcd.com/538/
              authString = 'Basic ' + new Buffer(`${this.username}:${this.password}`).toString('base64');
            }

            resolve(this.request(requestName, Object.assign(headers, { Authorization: authString }), url));
            return;
          }

          reject(new Error(`Bad RTSP status code ${statusCode}!`));
          return;
        }
      };

      this.once("response", responseHandler);
    });
  }

  respond(status, headers) {
    headers = headers || {};

    // mutable via string addition
    let res = `RTSP/1.0 ${status}\r\n`;

    Object.assign(headers, this.headers);
    const headerKeys = Object.keys(headers);

    res += headerKeys.map((header, index) => {
      return `${header}: ${headers[header].toString()}`;
    }).join('\r\n');

    headerKeys.forEach((header, index) => {
      res += `${header}: ${headers[headers].toString()}\r\n`;
    });

    this.emit("log", res, "C->S");
    this._client.write(`${res}\r\n`);
  }

  play() {
    if (!this.isConnected) {
      throw new Error("Client is not connected.");
    }

    return this.request("PLAY", { Session: this._session }).then(() => this);
  }

  pause() {
    if (!this.isConnected) {
      throw new Error("Client is not connected.");
    }

    return this.request("PAUSE", { Session: this._session }).then(() => this);
  }

  close(isImmediate) {
    const promiseFunc = (resolve, reject) => {
      this._client.end();
      this.removeAllListeners("response");

      this.isConnected = false;
      this._cSeq = 0;

      return this;
    };

    if (!isImmediate) {
      return this.request("TEARDOWN", { Session: this._session }).then(() => new Promise(promiseFunc));
    } else {
      return new Promise(promiseFunc);
    }
  }
}

module.exports = { RtspClient };
