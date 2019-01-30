"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const dgram = require("dgram");
const url_1 = require("url");
const events_1 = require("events");
const util_1 = require("./util");
const transform = require("sdp-transform");
const RTP_AVP = "RTP/AVP";
const STATUS_OK = 200;
const STATUS_UNAUTH = 401;
const WWW_AUTH = "WWW-Authenticate";
const WWW_AUTH_REGEX = new RegExp('([a-zA-Z]+)\s*=\s*"?((?<=").*?(?=")|.*?(?=,?\s*[a-zA-Z]+\s*\=)|.+[^=])', "g");
var ReadStates;
(function (ReadStates) {
    ReadStates[ReadStates["SEARCHING"] = 0] = "SEARCHING";
    ReadStates[ReadStates["READING_RTSP_HEADER"] = 1] = "READING_RTSP_HEADER";
    ReadStates[ReadStates["READING_RTSP_PAYLOAD"] = 2] = "READING_RTSP_PAYLOAD";
    ReadStates[ReadStates["READING_RAW_PACKET_SIZE"] = 3] = "READING_RAW_PACKET_SIZE";
    ReadStates[ReadStates["READING_RAW_PACKET"] = 4] = "READING_RAW_PACKET";
})(ReadStates || (ReadStates = {}));
;
class RTSPClient extends events_1.EventEmitter {
    constructor(username, password, headers) {
        super();
        this.isConnected = false;
        this._cSeq = 0;
        this.readState = ReadStates.SEARCHING;
        // Used as a cache for the data stream.
        // What's in here is based on current #readState.
        this.messageBytes = [];
        // Used for parsing RTSP responses,
        // Content-Length header in the RTSP message.
        this.rtspContentLength = 0;
        this.rtspStatusLine = "";
        this.rtspHeaders = {};
        // Used for parsing RTP/RTCP responses.
        this.rtspPacketLength = 0;
        this.rtspPacket = new Buffer("");
        this.rtspPacketPointer = 0;
        // Used in #_emptyReceiverReport.
        this.clientSSRC = util_1.generateSSRC();
        this.username = username;
        this.password = password;
        this.headers = Object.assign({}, (headers || {}), { "User-Agent": "yellowstone/3.x" });
    }
    // This manages the lifecycle for the RTSP connection
    // over TCP.
    //
    // Sets #_client.
    //
    // Handles receiving data & closing port, called during
    // #connect.
    _netConnect(hostname, port) {
        return new Promise((resolve, reject) => {
            // Set after listeners defined.
            let client;
            const errorListener = (err) => {
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
                if (name === "REDIRECT" && headers.Location) {
                    this.close();
                    this.connect(headers.Location);
                }
            };
            client = net.connect(port, hostname, () => {
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
    async connect(url, options = { keepAlive: true, connection: 'udp' }) {
        const { keepAlive, connection } = options;
        const { hostname, port } = url_1.parse(this._url = url);
        if (!hostname) {
            throw new Error('URL parsing error in connect method.');
        }
        await this._netConnect(hostname, parseInt(port || "554"));
        await this.request("OPTIONS");
        const describeRes = await this.request("DESCRIBE", { Accept: "application/sdp" });
        if (!describeRes || !describeRes.mediaHeaders) {
            throw new Error('No media headers on DESCRIBE; RTSP server is broken (sanity check)');
        }
        // For now, only RTP/AVP is supported.
        const { media } = transform.parse(describeRes.mediaHeaders.join("\r\n"));
        // From parsed SDP.
        const mediaSource = media.find(source => source.type === "video" && source.protocol === RTP_AVP);
        if (!mediaSource || !mediaSource.rtp) {
            throw new Error(`Only video sources using the ${RTP_AVP} protocol are supported at this time.`);
        }
        if (mediaSource.control) {
            this._url += `/${mediaSource.control}`;
        }
        // Perform a SETUP with
        // either 'udp' RTP/RTCP packets
        // or with 'tcp' RTP/TCP packets which are interleaved into the TCP based RTSP socket
        let setupRes;
        if (connection === "udp") {
            // Create a pair of UDP listeners, even numbered port for RTP
            // and odd numbered port for RTCP
            const rtpPort = 5000;
            const rtpReceiver = dgram.createSocket("udp4");
            rtpReceiver.on("message", (buf, remote) => {
                const packet = util_1.parseRTPPacket(buf);
                this.emit("data", 0, packet.payload, packet);
            });
            const rtcpPort = rtpPort + 1;
            const rtcpReceiver = dgram.createSocket("udp4");
            rtcpReceiver.on("message", (buf, remote) => {
                const packet = util_1.parseRTCPPacket(buf);
                this.emit("controlData", 1, packet);
                const receiver_report = this._emptyReceiverReport();
                this._sendUDPData(remote.address, remote.port, receiver_report);
            });
            // Block until both UDP sockets are open.
            await new Promise(resolve => {
                rtpReceiver.bind(rtpPort, () => resolve());
            });
            await new Promise(resolve => {
                rtcpReceiver.bind(rtcpPort + 1, () => resolve());
            });
            setupRes = await this.request("SETUP", {
                Transport: `RTP/AVP;unicast;client_port=${rtpPort}-${rtcpPort}`
            });
        }
        else if (connection === "tcp") {
            // channel 0, RTP
            // channel 1, RTCP
            setupRes = await this.request("SETUP", { Transport: `RTP/AVP/TCP;interleaved=0-1` });
        }
        else {
            throw new Error(`Connection parameter to RTSPClient#connect is ${connection}, not udp or tcp!`);
        }
        if (!setupRes) {
            throw new Error('No SETUP response; RTSP server is broken (sanity check)');
        }
        const { headers } = setupRes;
        if (!headers.Transport) {
            throw new Error('No Transport header on SETUP; RTSP server is broken (sanity check)');
        }
        const transport = util_1.parseTransport(headers.Transport);
        if (transport.protocol !== 'RTP/AVP/TCP' && transport.protocol !== 'RTP/AVP') {
            throw new Error('Only RTSP servers supporting RTP/AVP(unicast) or RTP/ACP/TCP are supported at this time.');
        }
        if (headers.Unsupported) {
            this._unsupportedExtensions = headers.Unsupported.split(",");
        }
        if (headers.Session) {
            this._session = headers.Session.split(";")[0];
        }
        if (keepAlive) {
            // Start a Timer to send OPTIONS every 20 seconds to keep stream alive
            this._keepAliveID = setInterval(() => this.request("OPTIONS"), 20 * 1000);
        }
        const codec = mediaSource.rtp[0].codec;
        return {
            codec,
            mediaSource,
            transport: transport.parameters,
            isH264: codec === "H264"
        };
    }
    request(requestName, headersParam = {}, url) {
        if (!this._client) {
            return Promise.resolve();
        }
        const id = ++this._cSeq;
        // mutable via string addition
        let req = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;
        const headers = Object.assign({}, this.headers, headersParam);
        req += Object.entries(headers)
            .map(([key, value]) => `${key}: ${value}\r\n`)
            .join("");
        this.emit("log", req, "C->S");
        // Make sure to add an empty line after the request.
        this._client.write(`${req}\r\n`);
        return new Promise((resolve, reject) => {
            const responseHandler = (responseName, resHeaders, mediaHeaders) => {
                if (resHeaders.CSeq !== id && resHeaders.Cseq !== id) {
                    return;
                }
                this.removeListener("response", responseHandler);
                const statusCode = parseInt(responseName.split(" ")[1]);
                if (statusCode === STATUS_OK) {
                    if (!!mediaHeaders.length) {
                        resolve({
                            headers: resHeaders,
                            mediaHeaders
                        });
                    }
                    else {
                        resolve({
                            headers: resHeaders
                        });
                    }
                }
                else {
                    const authHeader = resHeaders[WWW_AUTH];
                    // We have status code unauthenticated.
                    if (statusCode === STATUS_UNAUTH && authHeader) {
                        const type = authHeader.split(" ")[0];
                        // Get auth properties from WWW_AUTH header.
                        let realm = "";
                        let nonce = "";
                        let match = WWW_AUTH_REGEX.exec(authHeader);
                        while (match != null) {
                            const prop = match[1];
                            if (prop == "realm" && match[2]) {
                                realm = match[2];
                            }
                            if (prop == "nonce" && match[2]) {
                                nonce = match[2];
                            }
                            match = WWW_AUTH_REGEX.exec(authHeader);
                        }
                        // mutable, corresponds to Authorization header
                        let authString = "";
                        if (type === "Digest") {
                            // Digest Authentication
                            const ha1 = util_1.getMD5Hash(`${this.username}:${realm}:${this.password}`);
                            const ha2 = util_1.getMD5Hash(`${requestName}:${this._url}`);
                            const ha3 = util_1.getMD5Hash(`${ha1}:${nonce}:${ha2}`);
                            authString = `Digest username="${this.username}",realm="${realm}",nonce="${nonce}",uri="${this._url}",response="${ha3}"`;
                        }
                        else if (type === "Basic") {
                            // Basic Authentication
                            // https://xkcd.com/538/
                            const b64 = new Buffer(`${this.username}:${this.password}`).toString("base64");
                            authString = `Basic ${b64}`;
                        }
                        Object.assign(headers, {
                            Authorization: authString
                        });
                        resolve(this.request(requestName, headers, url));
                        return;
                    }
                    reject(new Error(`Bad RTSP status code ${statusCode}!`));
                    return;
                }
            };
            this.on("response", responseHandler);
        });
    }
    respond(status, headersParam = {}) {
        if (!this._client) {
            return;
        }
        // mutable via string addition
        let res = `RTSP/1.0 ${status}\r\n`;
        const headers = Object.assign({}, this.headers, headersParam);
        res += Object.entries(headers)
            .map(([key, value]) => `${key}: ${value}\r\n`)
            .join("");
        this.emit("log", res, "C->S");
        this._client.write(`${res}\r\n`);
    }
    async play() {
        if (!this.isConnected) {
            throw new Error("Client is not connected.");
        }
        await this.request("PLAY", { Session: this._session });
        return this;
    }
    async pause() {
        if (!this.isConnected) {
            throw new Error("Client is not connected.");
        }
        await this.request("PAUSE", { Session: this._session });
        return this;
    }
    async close(isImmediate = false) {
        if (!this._client) {
            return this;
        }
        if (!isImmediate) {
            await this.request("TEARDOWN", {
                Session: this._session
            });
        }
        this._client.end();
        this.removeAllListeners("response");
        if (this._keepAliveID) {
            clearInterval(this._keepAliveID);
            this._keepAliveID = 0;
        }
        this.isConnected = false;
        this._cSeq = 0;
        return this;
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
                this.messageBytes = [data[index]];
                index++;
                this.readState = ReadStates.READING_RAW_PACKET_SIZE;
            }
            else if (this.readState == ReadStates.READING_RAW_PACKET_SIZE) {
                // accumulate bytes for $, channel and length
                this.messageBytes.push(data[index]);
                index++;
                if (this.messageBytes.length == 4) {
                    this.rtspPacketLength = (this.messageBytes[2] << 8) + this.messageBytes[3];
                    if (this.rtspPacketLength > 0) {
                        this.rtspPacket = new Buffer(this.rtspPacketLength);
                        this.rtspPacketPointer = 0;
                        this.readState = ReadStates.READING_RAW_PACKET;
                    }
                    else {
                        this.readState = ReadStates.SEARCHING;
                    }
                }
            }
            else if (this.readState == ReadStates.READING_RAW_PACKET) {
                this.rtspPacket[this.rtspPacketPointer++] = data[index];
                index++;
                if (this.rtspPacketPointer == this.rtspPacketLength) {
                    const packetChannel = this.messageBytes[1];
                    if (packetChannel === 0) {
                        const packet = util_1.parseRTPPacket(this.rtspPacket);
                        this.emit("data", packetChannel, packet.payload, packet);
                    }
                    if (packetChannel === 1) {
                        const packet = util_1.parseRTCPPacket(this.rtspPacket);
                        this.emit("controlData", packetChannel, packet);
                        const receiver_report = this._emptyReceiverReport();
                        this._sendInterleavedData(packetChannel, receiver_report);
                    }
                    this.readState = ReadStates.SEARCHING;
                }
                // read response data
            }
            else if (this.readState == ReadStates.SEARCHING && data[index] == RTSP_HEADER_START) {
                // found the start of a RTSP rtsp_message
                this.messageBytes = [data[index]];
                index++;
                this.readState = ReadStates.READING_RTSP_HEADER;
            }
            else if (this.readState == ReadStates.READING_RTSP_HEADER) {
                // Reading a RTSP message.
                // Add character to the messageBytes
                // Ignore /r (13) but keep /n (10)
                if (data[index] != 13) {
                    this.messageBytes.push(data[index]);
                }
                index++;
                // if we have two new lines back to back then we have a complete RTSP command,
                // note we may still need to read the Content Payload (the body) e.g. the SDP
                if (this.messageBytes.length >= 2 &&
                    this.messageBytes[this.messageBytes.length - 2] == ENDL &&
                    this.messageBytes[this.messageBytes.length - 1] == ENDL) {
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
                    }
                    else {
                        this.messageBytes = [];
                        this.readState = ReadStates.READING_RTSP_PAYLOAD;
                    }
                }
            }
            else if (this.readState == ReadStates.READING_RTSP_PAYLOAD &&
                this.messageBytes.length < this.rtspContentLength) {
                // Copy data into the RTSP payload
                this.messageBytes.push(data[index]);
                index++;
                if (this.messageBytes.length == this.rtspContentLength) {
                    const text = String.fromCharCode.apply(null, this.messageBytes);
                    const mediaHeaders = text.split("\n");
                    // Emit the RTSP message
                    this.emit("log", String.fromCharCode.apply(null, this.messageBytes) + text, "S->C");
                    this.emit("response", this.rtspStatusLine, this.rtspHeaders, mediaHeaders);
                    this.readState = ReadStates.SEARCHING;
                }
            }
            else {
                // unexpected data
                throw new Error("Bug in RTSP data framing, please file an issue with the author with stacktrace.");
            }
        } // end while
    }
    _sendInterleavedData(channel, buffer) {
        if (!this._client) {
            return;
        }
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
        udp.send(buffer, 0, buffer.length, port, host, (err, bytes) => {
            // TODO: Don't ignore errors.
            udp.close();
        });
    }
    _emptyReceiverReport() {
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
exports.default = RTSPClient;
//# sourceMappingURL=RTSPClient.js.map