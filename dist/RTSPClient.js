"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const tls = require("tls");
const dgram = require("dgram");
const url_1 = require("url");
const events_1 = require("events");
const util_1 = require("./util");
const transform = require("sdp-transform");
const RTPPacket_1 = require("./transports/RTPPacket");
const RTP_AVP = "RTP/AVP";
const STATUS_OK = 200;
const STATUS_UNAUTH = 401;
// The WWW_AUTH is of the format
//      TOKEN key=value
//      TOKEN key1=value1,key2=value2
//      TOKEN key1="value1",key2=value2
// RegEx reminder ? = Zero or One item
//                * = Zero or More items
//                + = 1 or More items
//                \s is whitespace. But we need to 'escape the slash', hence \\s (or put the regex in / / characters)
//                ?= is a lookahead
// The RegEx has two 'Groups'
//      
// Group 1 (finding the Key)
//    Look for one or more characters (a..z or A..Z)
//    then look for whitespace
//    then look for 'equals'
//    then look for whitespace
//    then look for an optional Quote character
//
// Group 2 (finding the Value) -
//    Look for EITHER 'look backwards for a Quote', some characters, 'lookahead for a Quote'
//                 OR some characters until (by looking ahead) you can see that another key comes next. The lookahead is 'optinal whitespace' 'comma' 'optional whitespace' 'chars' 'optinal whitespace' 'equals'
//                 OR some characters followed by 'optinal whitespace'
const WWW_AUTH = "WWW-Authenticate";
const WWW_AUTH_REGEX = new RegExp('([a-zA-Z]+)\\s*=\\s*"?((?<=").*?(?=")|.*?(?=\\s*,?\\s*[a-zA-Z]+\\s*=)|.+[^\\s])', "g");
var ReadStates;
(function (ReadStates) {
    ReadStates[ReadStates["SEARCHING"] = 0] = "SEARCHING";
    ReadStates[ReadStates["READING_RTSP_HEADER"] = 1] = "READING_RTSP_HEADER";
    ReadStates[ReadStates["READING_RTSP_PAYLOAD"] = 2] = "READING_RTSP_PAYLOAD";
    ReadStates[ReadStates["READING_RAW_PACKET_SIZE"] = 3] = "READING_RAW_PACKET_SIZE";
    ReadStates[ReadStates["READING_RAW_PACKET"] = 4] = "READING_RAW_PACKET";
})(ReadStates || (ReadStates = {}));
class RTSPClient extends events_1.EventEmitter {
    constructor(username, password, headers) {
        super();
        this.isConnected = false;
        this.closed = false;
        this._cSeq = 0;
        this._nextFreeInterleavedChannel = 0;
        this._nextFreeUDPPort = 5000;
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
        this.rtspPacket = Buffer.from("");
        this.rtspPacketPointer = 0;
        // Used in #_emptyReceiverReport.
        this.clientSSRC = (0, util_1.generateSSRC)();
        this.tcpSocket = new net.Socket();
        this.setupResult = [];
        this.ntpBaseDate_ms = new Date("1900/1/1").getTime();
        this.username = username;
        this.password = password;
        this.headers = Object.assign(Object.assign({}, (headers || {})), { "User-Agent": "yellowstone/3.x" });
    }
    // This manages the lifecycle for the RTSP connection
    // over TCP.
    //
    // Sets #_client.
    //
    // Handles receiving data & closing port, called during
    // #connect.
    _netConnect(hostname, port, secure = false) {
        return new Promise((resolve, reject) => {
            // Set after listeners defined.
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
            // rtsp or rtsps(with tls)
            let client;
            if (secure == false) {
                client = net.connect(port, hostname, () => {
                    this.isConnected = true;
                    this._client = client;
                    client.removeListener("error", errorListener);
                    this.on("response", responseListener);
                    resolve(this);
                });
            }
            else {
                const options = {
                    rejectUnauthorized: false
                };
                client = tls.connect(port, hostname, options, () => {
                    console.log("TLS Connection");
                    this.isConnected = true;
                    this._client = client;
                    client.removeListener("error", errorListener);
                    this.on("response", responseListener);
                    resolve(this);
                });
            }
            client.on("data", this._onData.bind(this));
            client.on("error", errorListener);
            client.on("close", closeListener);
            this.tcpSocket = client;
        });
    }
    async connect(url, { keepAlive = true, connection = "udp", secure = false, } = {
        keepAlive: true,
        connection: "udp",
        secure: false
    }) {
        const { hostname, port } = (0, url_1.parse)((this._url = url));
        if (!hostname) {
            throw new Error("URL parsing error in connect method.");
        }
        const details = [];
        await this._netConnect(hostname, parseInt(port || "554"), secure);
        await this.request("OPTIONS");
        const describeRes = await this.request("DESCRIBE", {
            Accept: "application/sdp",
        });
        if (!describeRes || !describeRes.mediaHeaders) {
            throw new Error("No media headers on DESCRIBE; RTSP server is broken (sanity check)");
        }
        // For now, only RTP/AVP is supported. (Some RTSPS servers use RTP/SAVP)
        const { media } = transform.parse(describeRes.mediaHeaders.join("\r\n"));
        // Loop over the Media Streams in the SDP looking for Video or Audio
        // In theory the SDP can contain multiple Video and Audio Streams. We only want one of each type
        let hasVideo = false;
        let hasAudio = false;
        let hasMetaData = false;
        let hasBackchannel = false;
        for (let x = 0; x < media.length; x++) {
            let needSetup = false;
            let codec = "";
            const mediaSource = media[x];
            // RFC says "If none of the direction attributes ("sendonly", "recvonly", "inactive", and "sendrecv") are present,
            // the "sendrecv" SHOULD be assumed
            if (mediaSource.direction == undefined)
                mediaSource.direction = "sendrecv"; //  Wowza does not send 'direction'
            if (mediaSource.type === "video" &&
                mediaSource.protocol === RTP_AVP &&
                mediaSource.rtp[0].codec === "H264") {
                this.emit("log", "H264 Video Stream Found in SDP", "");
                if (hasVideo == false) {
                    needSetup = true;
                    hasVideo = true;
                    codec = "H264";
                }
            }
            if (mediaSource.type === "video" &&
                mediaSource.protocol === RTP_AVP &&
                mediaSource.rtp[0].codec === "H265") {
                this.emit("log", "H265 Video Stream Found in SDP", "");
                if (hasVideo == false) {
                    needSetup = true;
                    hasVideo = true;
                    codec = "H265";
                }
            }
            if (mediaSource.type === "audio" &&
                (mediaSource.direction === "recvonly" || mediaSource.direction === "sendrecv") &&
                mediaSource.protocol === RTP_AVP &&
                mediaSource.rtp[0].codec.toLowerCase() === "mpeg4-generic" && // (RFC examples are lower case. Axis cameras use upper case)
                mediaSource.fmtp[0].config.includes("AAC")) {
                this.emit("log", "AAC Audio Stream Found in SDP", "");
                if (hasAudio == false) {
                    needSetup = true;
                    hasAudio = true;
                    codec = "AAC";
                }
            }
            if (mediaSource.type === "audio" &&
                mediaSource.direction === "sendonly" &&
                mediaSource.protocol === RTP_AVP) {
                this.emit("log", "Audio backchannel Found in SDP", "");
                if (hasBackchannel == false) {
                    needSetup = true;
                    hasBackchannel = true;
                    codec = mediaSource.rtp[0].codec;
                }
            }
            if (mediaSource.type === "application" &&
                mediaSource.protocol === RTP_AVP &&
                mediaSource.rtp[0].codec.toLowerCase() === "vnd.onvif.metadata") {
                this.emit("log", "ONVIF Meta Data Found in SDP", "");
                if (hasMetaData == false) {
                    needSetup = true;
                    hasMetaData = true;
                    codec = "vnd.onvif.metadata";
                }
            }
            if (needSetup) {
                let streamurl = "";
                // The 'control' in the SDP can be a relative or absolute uri
                if (mediaSource.control) {
                    if (mediaSource.control.toLowerCase().startsWith("rtsp://")) {
                        // absolute path
                        streamurl = mediaSource.control;
                    }
                    else {
                        // relative path
                        streamurl = this._url + "/" + mediaSource.control;
                    }
                }
                // Perform a SETUP on the streamurl
                // either 'udp' RTP/RTCP packets
                // or with 'tcp' RTP/TCP packets which are interleaved into the TCP based RTSP socket
                let setupRes;
                let rtpChannel;
                let rtcpChannel;
                let rtpReceiver = null; // UDP mode init value
                let rtcpReceiver = null; // UDP mode init value
                if (connection === "udp") {
                    // Create a pair of UDP listeners, even numbered port for RTP
                    // and odd numbered port for RTCP
                    rtpChannel = this._nextFreeUDPPort;
                    rtcpChannel = this._nextFreeUDPPort + 1;
                    this._nextFreeUDPPort += 2;
                    const rtpPort = rtpChannel;
                    rtpReceiver = dgram.createSocket("udp4");
                    rtpReceiver.on("message", (buf, remote) => {
                        let packet = (0, util_1.parseRTPPacket)(buf);
                        // Add wall clock time
                        const detail = this.setupResult.find(item => item.rtpChannel == rtpChannel);
                        if (detail != undefined)
                            packet.wallclockTime = this.GetWallClockTime(packet, detail);
                        this.emit("data", rtpPort, packet.payload, packet);
                    });
                    const rtcpPort = rtcpChannel;
                    rtcpReceiver = dgram.createSocket("udp4");
                    rtcpReceiver.on("message", (buf, remote) => {
                        const packet = (0, util_1.parseRTCPPacket)(buf);
                        // If this is a Sender Report, cache the NTP Wall Clock data
                        if (packet.packetType == 200 && packet.senderReport != undefined) {
                            let detail = this.setupResult.find(item => item.rtcpChannel == rtcpChannel);
                            if (detail != undefined) {
                                detail.sr_ntpMSW = packet.senderReport.ntpTimestampMSW;
                                detail.sr_ntpLSW = packet.senderReport.ntpTimestampLSW;
                                detail.sr_rtptimestamp = packet.senderReport.rtpTimestamp;
                            }
                        }
                        this.emit("controlData", rtcpPort, packet);
                        const receiver_report = this._emptyReceiverReport();
                        this._sendUDPData(remote.address, remote.port, receiver_report);
                    });
                    // Block until both UDP sockets are open.
                    await new Promise((resolve) => {
                        rtpReceiver === null || rtpReceiver === void 0 ? void 0 : rtpReceiver.bind(rtpPort, () => resolve({}));
                    });
                    await new Promise((resolve) => {
                        rtcpReceiver === null || rtcpReceiver === void 0 ? void 0 : rtcpReceiver.bind(rtcpPort, () => resolve({}));
                    });
                    const setupHeader = {
                        Transport: `RTP/AVP;unicast;client_port=${rtpPort}-${rtcpPort}`,
                    };
                    if (this._session)
                        Object.assign(setupHeader, { Session: this._session });
                    setupRes = await this.request("SETUP", setupHeader, streamurl);
                }
                else if (connection === "tcp") {
                    // channel 0, RTP
                    // channel 1, RTCP
                    rtpChannel = this._nextFreeInterleavedChannel;
                    rtcpChannel = this._nextFreeInterleavedChannel + 1;
                    this._nextFreeInterleavedChannel += 2;
                    const setupHeader = {
                        Transport: `RTP/AVP/TCP;interleaved=${rtpChannel}-${rtcpChannel}`,
                    };
                    if (this._session)
                        Object.assign(setupHeader, { Session: this._session }); // not used on first SETUP
                    setupRes = await this.request("SETUP", setupHeader, streamurl);
                }
                else {
                    throw new Error(`Connection parameter to RTSPClient#connect is ${connection}, not udp or tcp!`);
                }
                if (!setupRes) {
                    throw new Error("No SETUP response; RTSP server is broken (sanity check)");
                }
                const { headers } = setupRes;
                if (!headers.Transport) {
                    throw new Error("No Transport header on SETUP; RTSP server is broken (sanity check)");
                }
                const transport = (0, util_1.parseTransport)(headers.Transport);
                if (transport.protocol !== "RTP/AVP/TCP" &&
                    transport.protocol !== "RTP/AVP") {
                    throw new Error("Only RTSP servers supporting RTP/AVP(unicast) or RTP/AVP/TCP are supported at this time.");
                }
                // Patch from zoolyka (Zoltan Hajdu).
                // Try to open a hole in the NAT router (to allow incoming UDP packets)
                // by send a UDP packet for RTP and RTCP to the remote RTSP server.
                // Note, Roger did not have a router that needed this so the feature is untested.
                // May be better to change the RTCP message to a Receiver Report, leaving the RTP message as zero bytes
                if (connection === "udp" && transport && rtpReceiver && rtcpReceiver) {
                    rtpReceiver.send(Buffer.from(''), Number(transport.parameters["server_port"].split("-")[0]), hostname);
                    rtcpReceiver.send(Buffer.from(''), Number(transport.parameters["server_port"].split("-")[1]), hostname);
                }
                if (headers.Unsupported) {
                    this._unsupportedExtensions = headers.Unsupported.split(",");
                }
                if (headers.Session) {
                    this._session = headers.Session.split(";")[0];
                }
                const detail = {
                    codec,
                    mediaSource,
                    transport: transport.parameters,
                    isH264: codec === "H264",
                    rtpChannel,
                    rtcpChannel,
                };
                details.push(detail);
            } // end if (needSetup)
        } // end for loop, looping over each media stream
        if (keepAlive) {
            // Start a Timer to send OPTIONS every 20 seconds to keep stream alive
            // using the Session ID
            this._keepAliveID = setInterval(() => {
                this.request("OPTIONS", { Session: this._session });
                //        this.request("OPTIONS");
            }, 20 * 1000);
        }
        this.setupResult = details;
        return details;
    }
    request(requestName, headersParam = {}, url) {
        if (!this._client) {
            return Promise.resolve();
        }
        const id = ++this._cSeq;
        // mutable via string addition
        let req = `${requestName} ${url || this._url} RTSP/1.0\r\nCSeq: ${id}\r\n`;
        const headers = Object.assign(Object.assign({}, this.headers), headersParam);
        // NOTE:
        // If we cache the Authenitcation Type (Direct or Basic) then we could
        // re-compute an Authorization Header here and include in the RTSP Command
        // This would make connections a faster with fewer round-trips to the RTSP Server
        req += Object.entries(headers)
            .map(([key, value]) => `${key}: ${value}\r\n`)
            .join("");
        this.emit("log", req, "C->S");
        // Make sure to add an empty line after the request.
        this._client.write(`${req}\r\n`);
        return new Promise((resolve, reject) => {
            const responseHandler = (responseName, resHeaders, mediaHeaders) => {
                const firstAnswer = String(resHeaders[""]) || "";
                if (firstAnswer.indexOf("401") >= 0 && 'Authorization' in headers) {
                    // If the RTSP Command we sent included an Authorization and we have 401 error, then reject()
                    reject(new Error(`Bad RTSP credentials!`));
                    return;
                }
                if (resHeaders.CSeq !== id) {
                    return;
                }
                this.removeListener("response", responseHandler);
                const statusCode = parseInt(responseName.split(" ")[1]);
                if (statusCode === STATUS_OK) {
                    if (mediaHeaders.length > 0) {
                        resolve({
                            headers: resHeaders,
                            mediaHeaders,
                        });
                    }
                    else {
                        resolve({
                            headers: resHeaders,
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
                        let algorithm = "MD5"; // Default to MD5 if no algorthm is given. Milestone's RTSP server also supports SHA-256 for FIPS
                        let match = WWW_AUTH_REGEX.exec(authHeader);
                        while (match != null) {
                            const prop = match[1];
                            if (prop == "realm" && match[2]) {
                                realm = match[2];
                            }
                            if (prop == "nonce" && match[2]) {
                                nonce = match[2];
                            }
                            if (prop == "algorithm" && match[2]) {
                                algorithm = match[2];
                            }
                            match = WWW_AUTH_REGEX.exec(authHeader);
                        }
                        // mutable, corresponds to Authorization header
                        let authString = "";
                        if (type === "Digest") {
                            // Digest Authentication
                            // Select Hash Function, default to MD5
                            const HashFunction = (algorithm == "SHA-256" ? util_1.getSHA256Hash : util_1.getMD5Hash);
                            const ha1 = HashFunction(`${this.username}:${realm}:${this.password}`);
                            const ha2 = HashFunction(`${requestName}:${this._url}`);
                            const ha3 = HashFunction(`${ha1}:${nonce}:${ha2}`);
                            // Some RTSP servers to not accept "algorithm=NNN" in the authString and reject the authentication. So only add algorithm=ZZZZ when not using MD5
                            if (algorithm == "MD5")
                                authString = `Digest username="${this.username}",realm="${realm}",nonce="${nonce}",uri="${this._url}",response="${ha3}"`;
                            else
                                authString = `Digest username="${this.username}",realm="${realm}",nonce="${nonce}",algorithm=${algorithm},uri="${this._url}",response="${ha3}"`;
                        }
                        else if (type === "Basic") {
                            // Basic Authentication
                            // https://xkcd.com/538/
                            const b64 = Buffer.from(`${this.username}:${this.password}`).toString("base64");
                            authString = `Basic ${b64}`;
                        }
                        Object.assign(headers, {
                            Authorization: authString,
                        });
                        resolve(this.request(requestName, headers, url)); // Call this.request with Authorized request
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
        const headers = Object.assign(Object.assign({}, this.headers), headersParam);
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
    }
    async pause() {
        if (!this.isConnected) {
            throw new Error("Client is not connected.");
        }
        await this.request("PAUSE", { Session: this._session });
    }
    async sendAudioBackChannel(audioChunk) {
        let rtp, buf;
        const bufSize = 160;
        while (audioChunk.length > 0) {
            if (audioChunk.length > bufSize) {
                buf = audioChunk.slice(0, bufSize);
                audioChunk = audioChunk.slice(bufSize, audioChunk.length);
            }
            else {
                buf = audioChunk.slice(0, audioChunk.length);
                audioChunk = Buffer.from([]);
            }
            if (!rtp)
                rtp = new RTPPacket_1.default(buf);
            else
                rtp.payload = buf;
            // rtp.type = 8;// set động
            rtp.time += buf.length;
            rtp.seq++;
            const bufferLength = Buffer.alloc(2);
            bufferLength.writeUInt16BE(rtp.packet.length, 0);
            let channelInterleaved = this.setupResult.filter((value) => {
                return value.mediaSource.type === 'audio' && value.mediaSource.direction === 'sendonly';
            })[0].transport.interleaved;
            /* RTSP Interleaved Frame structure
            |dollar sign|channel identifier|data length|
            |1 Byte     |1 Byte            |2 Bytes    |
            */
            channelInterleaved = channelInterleaved.split('-')[0];
            let interleavedHeader = Buffer.from([0x24]); // set '$'
            interleavedHeader = Buffer.concat([interleavedHeader, Buffer.from([channelInterleaved])]);
            interleavedHeader = Buffer.concat([interleavedHeader, bufferLength]);
            const dataToSend = Buffer.concat([interleavedHeader, rtp.packet]);
            await this._socketWrite(this.tcpSocket, dataToSend);
        }
        return;
    }
    async close(isImmediate = false) {
        if (this.closed)
            return;
        this.closed = true;
        if (!this._client) {
            return;
        }
        if (!isImmediate) {
            await this.request("TEARDOWN", {
                Session: this._session,
            });
        }
        this._client.end();
        this.removeAllListeners("response");
        if (this._keepAliveID != undefined) {
            clearInterval(this._keepAliveID);
            this._keepAliveID = undefined;
        }
        this.isConnected = false;
        this._cSeq = 0;
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
            if (this.readState == ReadStates.SEARCHING &&
                data[index] == PACKET_START) {
                this.messageBytes = [data[index]];
                index++;
                this.readState = ReadStates.READING_RAW_PACKET_SIZE;
            }
            else if (this.readState == ReadStates.READING_RAW_PACKET_SIZE) {
                // accumulate bytes for $, channel and length
                this.messageBytes.push(data[index]);
                index++;
                if (this.messageBytes.length == 4) {
                    this.rtspPacketLength =
                        (this.messageBytes[2] << 8) + this.messageBytes[3];
                    if (this.rtspPacketLength > 0) {
                        this.rtspPacket = Buffer.alloc(this.rtspPacketLength);
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
                    if ((packetChannel & 0x01) === 0) {
                        // even number
                        let packet = (0, util_1.parseRTPPacket)(this.rtspPacket);
                        // Get the Session Detail
                        const detail = this.setupResult.find(item => item.rtpChannel == packetChannel);
                        if (detail != undefined)
                            packet.wallclockTime = this.GetWallClockTime(packet, detail);
                        this.emit("data", packetChannel, packet.payload, packet);
                    }
                    if ((packetChannel & 0x01) === 1) {
                        // odd number
                        const packet = (0, util_1.parseRTCPPacket)(this.rtspPacket);
                        // If this is a Sender Report, cache the NTP Wall Clock data
                        if (packet.packetType == 200 && packet.senderReport != undefined) {
                            let detail = this.setupResult.find(item => item.rtcpChannel == packetChannel);
                            if (detail != undefined) {
                                detail.sr_ntpMSW = packet.senderReport.ntpTimestampMSW;
                                detail.sr_ntpLSW = packet.senderReport.ntpTimestampLSW;
                                detail.sr_rtptimestamp = packet.senderReport.rtpTimestamp;
                            }
                        }
                        this.emit("controlData", packetChannel, packet);
                        const receiver_report = this._emptyReceiverReport();
                        this._sendInterleavedData(packetChannel, receiver_report);
                    }
                    this.readState = ReadStates.SEARCHING;
                }
                // read response data
            }
            else if (this.readState == ReadStates.SEARCHING &&
                data[index] == RTSP_HEADER_START) {
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
                    lines.forEach((line) => {
                        const indexOf = line.indexOf(":");
                        if (indexOf !== line.length - 1) {
                            const key = line.substring(0, indexOf).trim();
                            const data = line.substring(indexOf + 1).trim();
                            this.rtspHeaders[key] =
                                key != "Session" && data.match(/^[0-9]+$/)
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
        const header = Buffer.alloc(4);
        header[0] = 0x24; // ascii $
        header[1] = channel;
        header[2] = (buffer.length >> 8) & 0xff;
        header[3] = (buffer.length >> 0) & 0xff;
        const data = Buffer.concat([header, buffer]);
        this._client.write(data);
    }
    _sendUDPData(host, port, buffer) {
        const udp = dgram.createSocket("udp4");
        udp.send(buffer, 0, buffer.length, port, host, (err, bytes) => {
            // TODO: Don't ignore errors.
            udp.close();
        });
    }
    _emptyReceiverReport() {
        const report = Buffer.alloc(8);
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
    async _socketWrite(socket, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                socket.write(data, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(undefined);
                    }
                });
            }, 20);
        });
    }
    // Note we have had a RTP Packet in Yellowstone for many years, but the Audio Backchennal code added another object also called RTPPacket
    GetWallClockTime(packet, detail) {
        // Add Wall Clock Time
        if (detail.sr_ntpMSW != undefined && detail.sr_ntpLSW != undefined && detail.sr_rtptimestamp != undefined && detail.mediaSource.rtp[0].rate != undefined) {
            let refTimestampSecs = detail.sr_rtptimestamp / detail.mediaSource.rtp[0].rate; // H264 is 90 kHz clock rate
            let packetTimestampSecs = packet.timestamp / detail.mediaSource.rtp[0].rate; // eg 90kHz
            let packetTimestampDeltaSecs = packetTimestampSecs - refTimestampSecs;
            let refTimestamp = new Date(this.ntpBaseDate_ms + (detail.sr_ntpMSW * 1000) + ((detail.sr_ntpLSW / Math.pow(2, 32)) * 1000));
            let wallclockTime = new Date(refTimestamp.getTime() + (packetTimestampDeltaSecs * 1000));
            return wallclockTime;
        }
        // Could not generate a Wall Clock Time
        return undefined;
    }
}
exports.default = RTSPClient;
//# sourceMappingURL=RTSPClient.js.map