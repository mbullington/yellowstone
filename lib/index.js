const net = require("net");
const urlParse = require("url");
const { EventEmitter } = require("events");

const { parseRTPPacket, parseRTCPPacket, getMD5Hash, parseTransport } = require('./util.js');

const transform = require("sdp-transform");

const WWW_AUTH_REGEX = new RegExp('([a-z]+)=\'([^,\s]+)\'');

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

    this.originalPacketLength = -1;
    this.packetLength = -1;
    this.packets = [];
    this.packet_channel_id = -1;

    this.headers = Object.assign({ "User-Agent": "yellowstone/2.0.0" },
        headers || {});
  }

  _onData(data) {
    if (this.packetLength > 0 || data[0] === 0x24) {
      // currently processing a RTP or RTCP packet OR the new data starts with a RTP or RTCP marker (0x24 '$')
      let index = 0;
      
      if (this.packetLength > 0) {
        // Have already received an part of a RTP or RTCP packet. Append the new data
        const packetLength = this.packetLength;
        this.packets.push(data.slice(index, Math.min(this.packetLength, data.length)));
        this.packetLength -= data.length;

        if (this.packetLength > 0) {
          return;
        }

        this.packetLength = -1;

        let packet;
        if (this.packet_channel_id === 0) {
          packet = parseRTPPacket(Buffer.concat(this.packets));
          if (packet.length + 16 !== this.originalPacketLength) {
            throw new Error("Bug in RTSP data framing, please file an issue with the author w/ stacktrace.");
          }
        }
        if (this.packet_channel_id === 1) {
          packet = parseRTCPPacket(Buffer.concat(this.packets));
        }

        this.packets = [];

        this.emit("data", this.packet_channel_id, packet.payload, packet);

        index += packetLength;
      }

      while (data.length > index && data[index] === 0x24) {
        this.packet_channel_id = data.readUInt8(index + 1);
        this.originalPacketLength = this.packetLength = data.readUInt16BE(index + 2);
        index += 4;

        this.packets.push(data.slice(index, Math.min(index + this.packetLength, data.length)));
        this.packetLength -= (data.length - index);

        if (this.packetLength > 0) {
          return;
        }

        this.packetLength = -1;

        let packet;
        if (this.packet_channel_id === 0) {
          packet = parseRTPPacket(Buffer.concat(this.packets));
          if (packet.length + 16 !== this.originalPacketLength) {
            throw new Error("Bug in RTSP data framing, please file an issue with the author w/ stacktrace.");
          }
        }
        if (this.packet_channel_id === 1) {
          packet = parseRTCPPacket(Buffer.concat(this.packets));
        }

        this.packets = [];

        this.emit("data", this.packet_channel_id, packet.payload, packet);

        index += this.originalPacketLength;
      }

      return;
    }

    data = data.toString("utf8");

    if (data.indexOf("RTSP") < 0) {
      throw new Error("Unknown protocol? Please make sure you are connecting to an RTSP server.");
    }

    this.emit("log", data, "S->C");

    const lines = data.split("\n");
    const headers = {};
    const mediaHeaders = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line[1] === "=") {
        mediaHeaders.push(line);
      } else {
        const indexOf = line.indexOf(":");

        if (indexOf !== line.length - 1) {
          const key = line.substring(0, indexOf).trim();
          const data = line.substring(indexOf + 1).trim();

          headers[key] = data.match(/^[0-9]+$/) ? parseInt(data, 10) : data;
        }
      }
    }

    this.emit("response", lines[0], headers, mediaHeaders);
  }

  connect(url) {
    const { hostname, port } = urlParse.parse((this._url = url));
    // mutable
    let format = "";

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
    }).then(_ => {
      return this.request("DESCRIBE", { Accept: "application/sdp" });
    }).then(obj => {
      const sdp = transform.parse(obj.mediaHeaders.join("\r\n"));

      // mutable, set by forEach
      let mediaSource;
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

      // const transport = parseTransport(headers.Transport);
      this._session = headers.Session;

      return {
        format
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
      return this.request("TEARDOWN", { Session: this._session }).then(() => new Promise(promise));
    } else {
      return new Promise(promise);
    }
  }
}

module.exports = { RtspClient };
