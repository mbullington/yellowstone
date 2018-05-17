const net = require("net");
const dgram = require('dgram');
const urlParse = require("url");
const flow = require('nimble');
const { EventEmitter } = require("events");

const { parseRTPPacket, parseRTCPPacket, getMD5Hash, parseTransport, generateSSRC } = require('./util.js');
const { H264Transport } = require("./transports/h264");

const transform = require("sdp-transform");

const RTP_AVP = "RTP/AVP";

const STATUS_OK = 200;
const STATUS_UNAUTH = 401;

const WWW_AUTH = "WWW-Authenticate";
const WWW_AUTH_REGEX = new RegExp('([a-z]+)=\"([^,\s]+)\"',"g");

const ReadStates = {
  SEARCHING: 0,
  READING_RTSP_HEADER: 1,
  READING_RTSP_PAYLOAD: 2,
  READING_RAW_PACKET_SIZE: 3,
  READING_RAW_PACKET: 4
};

class RtspClient extends EventEmitter {
  /* (my faux TypeScript variable definitions)

  _client: net.Socket;
  _cSeq: int;
  _unsupportedExtensions: string[];
  _session: string;

  username: string;
  password: string;

  readState: ReadStates;

  messageBytes: num[];
  
  rtspContentLength: num;
  rtspStatusLine: string;
  rtspHeaders: object<string, string | int>;

  rtspPacketLength: int;
  rtspPacket: num[];
  rtspPacketPointer: int; ???

  headers: object<string, string>;

  connection: string; // values are udp or tcp
  */
  
  constructor(username, password, headers) {
    super();

    headers = headers || {};
    
    this.isConnected = false;

    // internal variables

    // set by url parameter in #connect
    this._url;
    // set by #_netConnect
    this._client;
    this._cSeq = 0;

    // set by #connect
    this._unsupportedExtensions = null;
    // set by #connect
    // ex. 'SessionId'[';timeout=seconds']
    this._session = null;
    // set by setInterval in #connect
    this._keepAliveID;

    this.username = username;
    this.password = password;

    this.readState = ReadStates.SEARCHING;

    // used as a cache for data stream
    // different contents based on current read states
    this.messageBytes = []; // RTSP Message

    // used to parse RTSP response
    // From Content-Length: in the RTSP message
    this.rtspContentLength = 0; 
    this.rtspStatusLine = "";
    this.rtspHeaders = [];

    // used to parse RTP/RTCP response
    this.rtspPacketLength = 0;
    this.rtspPacketPointer = 0;    
    this.rtspPacket;

    this.headers = Object.assign({ "User-Agent": "yellowstone/2.0.0" }, headers);

    this.clientSSRC = generateSSRC();
  }

  _netConnect(hostname, port) {
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
    });
  }

  connect(url, options) {
    options = options || null;
    options.keepAlive = options.keepAlive == null ? true : options.keepAlive;
    options.connection = (options.connection || 'udp').toLowerCase();


    const { hostname, port } = urlParse.parse((this._url = url));
    // both mutable, set by #then callbacks to be used/returned
    // ex. H264
    let codec = "";
    // from parsed SDP
    let mediaSource = null;

    return this._netConnect(hostname, port)
      .then(_ => this.request("OPTIONS"))
      .then(_ => this.request("DESCRIBE", { Accept: "application/sdp" }))
      .then(obj => {
        const sdp = transform.parse(obj.mediaHeaders.join("\r\n"));

        // for now, only RTP/AVP is supported
        sdp.media.some(media => {
          if (media.type === "video" && media.protocol === RTP_AVP) {
            mediaSource = media;
            return true;
          }

          return false;
        });

        if (!mediaSource) {
          throw new Error(
            `Only video sources using the ${RTP_AVP} protocol are supported at this time.`
          );
        }

        if (mediaSource.control) {
          this._url += `/${mediaSource.control}`;
        }

        mediaSource.rtp.some(obj => {
          if (!!obj.codec && !!obj.codec.length) {
            codec = obj.codec;
            return true;
          }

          return false;
        });

        // Perform a SETUP with
        // either 'udp' RTP/RTCP packets
        // or with 'tcp' RTP/TCP packets which are interleaved into the TCP based RTSP socket

        if (options.connection == 'udp') {
          // Create a pair of UDP listeners, even numbered port for RTP
          // and odd numbered port for RTCP

          this.video_rtp_receiver = dgram.createSocket('udp4');
          this.video_rtp_receiver.on('message', (buf, remote) => {
            const packet = parseRTPPacket(buf);
            this.emit("data", 0, packet.payload, packet);
          });

          this.video_rtcp_receiver = dgram.createSocket('udp4');
          this.video_rtcp_receiver.on('message', (buf, remote) => {
            const packet = parseRTCPPacket(buf);
            this.emit("controlData", 1, packet);
            const receiver_report = this._GenerateEmptyReceiverReport();
            this._sendUDPData(remote.address, remote.port, receiver_report);
          });

          let base_port = 5000;
          let parent = this;

          // block until both UDP sockets are open using nimble
          flow.series([
            function(callback) {
              parent.video_rtp_receiver.bind(base_port, () => {
                callback();
              });
            },
            function(callback) {
              parent.video_rtcp_receiver.bind(base_port+1, () => {
                callback();
              });
            }
          ]);

          this.video_rtp_port = base_port;
          this.video_rtcp_port = base_port + 1;

          return this.request("SETUP", { Transport: `RTP/AVP;unicast;client_port=${this.video_rtp_port}-${this.video_rtcp_port}` });
        }
        if (options.connection == 'tcp') {
          // channel 0, RTP
          // channel 1, RTCP
          return this.request("SETUP", { Transport: `RTP/AVP/TCP;interleaved=0-1` });
        }
      })
      .then(headers => {
        const transport = parseTransport(headers.Transport);
        
        if (transport.protocol !== 'RTP/AVP/TCP' && transport.protocol !== 'RTP/AVP') {
          throw new Error(
            'Only RTSP servers supporting RTP/AVP(unicast) or RTP/ACP/TCP are supported at this time.'
          );
        }

        if (headers.Unsupported) {
          this._unsupportedExtensions = headers.Unsupported.split(",");
        }

        this._session = headers.Session.split(";")[0];

        if (options.keepAlive) {
          // Start a Timer to send OPTIONS every 20 seconds to keep stream alive
          this._keepAliveID = setInterval(() => this.request("OPTIONS"), 20 * 1000);
        }

        return {
          codec,
          mediaSource,
          transport: transport.parameters,
          isH264: codec === "H264",
          get format() {
            console.log("yellowstone: Please don't use format. To remove confusion, this was renamed to simply 'codec'.");
            return codec;
          }
        };
      });
  }

  request(requestName, headers, url) {
    headers = headers || {};

    const id = ++this._cSeq;
    // mutable via string addition
    let req = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;

    Object.assign(headers, this.headers);
    const headerKeys = Object.keys(headers);

    req += headerKeys
      .map(header => `${header}: ${headers[header]}\r\n`)
      .join("");

    let requestHeaders = headers;

    this.emit("log", req, "C->S");
    // make sure to add empty line
    this._client.write(`${req}\r\n`);
    
    return new Promise((resolve, reject) => {
      const responseHandler = (responseName, headers, mediaHeaders) => {
        if (headers.CSeq !== id && headers.Cseq !== id) {
          return;
        }

        this.removeListener("response", responseHandler);

        const statusCode = parseInt(responseName.split(" ")[1]);

        if (statusCode === STATUS_OK) {
          if (!!mediaHeaders.length) {
            resolve({ headers, mediaHeaders });
          } else {
            resolve(headers);
          }
        } else {
          // bad status code
          if (statusCode === STATUS_UNAUTH) {
            const type = headers[WWW_AUTH].split(" ")[0];

            // get information from WWW_AUTH header
            const authHeaders = {};
            {
              var match = WWW_AUTH_REGEX.exec(headers[WWW_AUTH])
              while (match != null) {
                authHeaders[match[1]] = match[2];
                match = WWW_AUTH_REGEX.exec(headers[WWW_AUTH]);
              }
            }

            // mutable, corresponds to Authorization header
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
              const b64 = new Buffer(`${this.username}:${this.password}`).toString("base64");
              authString = `Basic ${b64}`;
            }

            resolve(this.request(
                requestName,
                Object.assign(requestHeaders, { Authorization: authString }),
                url));
            return;
          }

          reject(new Error(`Bad RTSP status code ${statusCode}!`));
          return;
        }
      };

      this.on("response", responseHandler);
    });
  }

  respond(status, headers) {
    headers = headers || {};

    // mutable via string addition
    let res = `RTSP/1.0 ${status}\r\n`;

    Object.assign(headers, this.headers);
    const headerKeys = Object.keys(headers);

    res += headerKeys
      .map(header => `${header}: ${headers[header]}\r\n`)
      .join("");

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

      if (this._keepAliveID) {
        clearInterval(this._keepAliveID);
        this._keepAliveID = undefined;
      }

      this.isConnected = false;
      this._cSeq = 0;

      return this;
    };

    if (!isImmediate) {
      return this.request("TEARDOWN", { Session: this._session })
        .then(() => new Promise(promiseFunc));
    } else {
      return new Promise(promiseFunc);
    }
  }

  _onData(data) {
    let index = 0;

    // $
    const PACKET_START = 0x24;
    // R
    const RTSP_HEADER_START = 0x52;
    // /n
    const ENDL = 10;

    while (index < data.length) {
      // read RTP or RTCP packet
      if (this.readState == ReadStates.SEARCHING && data[index] == PACKET_START) {
        this.messageBytes = [ data[index] ];
        index++;

        this.readState = ReadStates.READING_RAW_PACKET_SIZE;
      } else if (this.readState == ReadStates.READING_RAW_PACKET_SIZE) {
        // accumulate bytes for $, channel and length
        this.messageBytes.push(data[index]);
        index++;

        if (this.messageBytes.length == 4) {
          this.rtspPacketLength = (this.messageBytes[2] << 8) + this.messageBytes[3];

          if (this.rtspPacketLength > 0) {
            this.rtspPacket = new Buffer(this.rtspPacketLength);
            this.rtspPacketPointer = 0;
            this.readState = ReadStates.READING_RAW_PACKET;
          } else {
            this.readState = ReadStates.SEARCHING;
          }
        }
      } else if (this.readState == ReadStates.READING_RAW_PACKET) {
        this.rtspPacket[this.rtspPacketPointer++] = data[index];
        index++;

        if (this.rtspPacketPointer == this.rtspPacketLength) {
          const packetChannel = this.messageBytes[1];
          if (packetChannel === 0) {
            const packet = parseRTPPacket(this.rtspPacket);
            this.emit("data", packetChannel, packet.payload, packet);
          }
          if (packetChannel === 1) {
            const packet = parseRTCPPacket(this.rtspPacket);
            this.emit("controlData", packetChannel, packet);
            const receiver_report = this._GenerateEmptyReceiverReport();
            this._sendInterleavedData(packetChannel, receiver_report);
          }
          this.readState = ReadStates.SEARCHING;
        }
      // read response data
      } else if (this.readState == ReadStates.SEARCHING && data[index] == RTSP_HEADER_START) {
        // found the start of a RTSP rtsp_message
        this.messageBytes = [ data[index] ];
        index++;

        this.readState = ReadStates.READING_RTSP_HEADER;
      } else if (this.readState == ReadStates.READING_RTSP_HEADER) {
        // Reading a RTSP message.

        // Add character to the messageBytes
        // Ignore /r (13) but keep /n (10)
        if (data[index] != 13) {
          this.messageBytes.push(data[index]);
        }
        index++;

        // if we have two new lines back to back then we have a complete RTSP command,
        // note we may still need to read the Content Payload (the body) e.g. the SDP
        if (
          this.messageBytes.length >= 2 &&
          this.messageBytes[this.messageBytes.length - 2] == ENDL &&
          this.messageBytes[this.messageBytes.length - 1] == ENDL
        ) {
          // Parse the Header

          const text = String.fromCharCode.apply(null, this.messageBytes);
          const lines = text.split("\n");

          this.rtspContentLength = 0;          
          this.rtspStatusLine = lines[0];
          this.rtspHeaders = {};

          lines.forEach(line => {
            const indexOf = line.indexOf(":");
            
            if (indexOf !== line.length - 1) {
              const key = line.substring(0, indexOf).trim();
              const data = line.substring(indexOf + 1).trim();

              this.rtspHeaders[key] =
                (key != "Session" && data.match(/^[0-9]+$/))
                  ? parseInt(data, 10)
                  : data;
            
              // workaround for buggy Hipcam RealServer/V1.0 camera which returns Content-length and not Content-Length
              if (key.toLowerCase() == "content-length") {
                this.rtspContentLength = parseInt(data, 10);
              }
            }
          });

          // if no content length, there there's no media headers
          // emit the message
          if (!this.rtspContentLength) {
            this.emit("log", text, "S->C");

            this.emit("response", this.rtspStatusLine, this.rtspHeaders, []);
            this.readState = ReadStates.SEARCHING;
          } else {
            this.messageBytes = [];
            this.readState = ReadStates.READING_RTSP_PAYLOAD;
          }
        }
      } else if (this.readState == ReadStates.READING_RTSP_PAYLOAD &&
          this.messageBytes.length < this.rtspContentLength) {
        // Copy data into the RTSP payload
        this.messageBytes.push(data[index]);
        index++;

        if (this.messageBytes.length == this.rtspContentLength) {
          const text = String.fromCharCode.apply(null, this.messageBytes);
          const mediaHeaders = text.split("\n");

          // Emit the RTSP message
          this.emit("log",
            String.fromCharCode.apply(null, this.messageBytes) + text,
            "S->C");

          this.emit("response", this.rtspStatusLine, this.rtspHeaders, mediaHeaders);
          this.readState = ReadStates.SEARCHING;
        }
      } else {
        // unexpected data
        throw new Error(
          "Bug in RTSP data framing, please file an issue with the author with stacktrace."
        );
      }
    } // end while
  }

  _sendInterleavedData(channel, buffer) {
    const req = `${buffer.length} bytes of interleaved data on channel ${channel}`;
    this.emit("log", req, "C->S");

    const header = new Buffer(4);
    header[0] = 0x24; // ascii $
    header[1] = channel;
    header[2] = (buffer.length >> 8) & 0xff;
    header[3] = (buffer.length >> 0) & 0xff;

    const data = Buffer.concat([header, buffer]);
    this._client.write(data);
  }

  _sendUDPData(host, port, buffer) {
    var udp = dgram.createSocket('udp4');
    udp.send(buffer, 0, buffer.length, port, host, function(err, bytes) {
      // ignore errors
      udp.close();
    });
  }

  _GenerateEmptyReceiverReport() {

    const report = new Buffer(8);
    const version = 2;
    const paddingBit = 0;
    const reportCount = 0; // an empty report
    const packetType = 201; // Receiver Report
    const length = report.length / 4 - 1; // num 32 bit words minus 1
    report[0] = (version << 6) + (paddingBit << 5) + reportCount;
    report[1] = packetType;
    report[2] = (length >> 8) & 0xff;
    report[3] = (length >> 0) & 0xff;
    report[4] = (this.clientSSRC >> 24) & 0xff;
    report[5] = (this.clientSSRC >> 16) & 0xff;
    report[6] = (this.clientSSRC >> 8) & 0xff;
    report[7] = (this.clientSSRC >> 0) & 0xff;

    return report;
  }
}

module.exports = {
  RtspClient,
  H264Transport
};
