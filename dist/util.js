"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function parseRTPPacket(buffer) {
    const hasExtensions = (buffer[0] >> 4) & 0x01;
    const marker = (buffer[1]) >>> 7;
    const num_csrc_identifiers = (buffer[0] & 0x0F);
    const payload = buffer.slice((num_csrc_identifiers * 4) + (hasExtensions ? 16 : 12));
    const { length } = payload;
    return {
        id: buffer.readUInt16BE(2),
        timestamp: buffer.readUInt32BE(4),
        marker,
        payload,
        length
    };
}
exports.parseRTPPacket = parseRTPPacket;
function parseRTCPPacket(buffer) {
    const packetType = buffer[1];
    const timestamp = buffer.readUInt32BE(16);
    return {
        timestamp,
        packetType,
        buffer
    };
}
exports.parseRTCPPacket = parseRTCPPacket;
// utility function for using crypto library
function getMD5Hash(str) {
    const md5 = crypto_1.createHash("md5");
    md5.update(str);
    return md5.digest("hex");
}
exports.getMD5Hash = getMD5Hash;
function parseTransport(transport) {
    const parameters = {};
    const parts = transport.split(";");
    const protocol = parts[0];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const index = part.indexOf("=");
        if (index > -1 && index !== part.length - 1) {
            parameters[part.substring(0, index)] = part.substring(index + 1);
        }
    }
    return {
        protocol,
        parameters
    };
}
exports.parseTransport = parseTransport;
function randInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randInclusive = randInclusive;
function generateSSRC() {
    return randInclusive(1, 0xffffffff);
}
exports.generateSSRC = generateSSRC;
//# sourceMappingURL=util.js.map