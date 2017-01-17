const { createHash } = require("crypto");
const { spawn } = require("child_process");

function parseRTPPacket(buffer) {
  const hasExtensions = (buffer[0] << 3) >>> 7;
  const num_csrc_identifiers = (buffer[0] & 0x0F);

  const payload = buffer.slice((num_csrc_identifiers * 4) + (hasExtensions ? 16 : 12));
  const { length } = payload;

  return {
    id: buffer.readUInt16BE(2),
    timestamp: buffer.readUInt32BE(4),
    payload,
    length
  };
}

function parseRTCPPacket(buffer) {
  const payload = buffer;
  const timestamp = buffer.readUInt32BE(16);
  return {
    timestamp,
    payload
  };
}

function getMD5Hash(str) {
  const md5 = createHash("md5");
  md5.update(str);

  return md5.digest("hex");
}

function parseTransport(transport) {
  const obj = {};
  const transportParts = transport.split(";");

  for (let i = 0; i < transportParts.length; i++) {
    const part = transportParts[i];
    const index = part.indexOf("=");

    if (index !== part.length - 1) {
      obj[part.substring(0, index)] = part.substring(index + 1);
    }
  }
  
  return obj;
}

module.exports = {
  parseRTPPacket,
  parseRTCPPacket,
  getMD5Hash,
  parseTransport
};
