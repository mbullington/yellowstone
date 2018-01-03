const { createHash } = require("crypto");
const { spawn } = require("child_process");

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

function parseRTCPPacket(buffer) {
  const packetType = buffer[1];
  const timestamp = buffer.readUInt32BE(16);

  return {
    timestamp,
    packetType,
    buffer,
    get payload() {
      console.log("yellowstone: Please don't use payload. To remove confusion, this was renamed to simply 'buffer'.");
      return buffer;
    }
  };
}

// utility function for using crypto library
function getMD5Hash(str) {
  const md5 = createHash("md5");
  md5.update(str);

  return md5.digest("hex");
}

function parseTransport(transport) {
  const obj = {};
  const parts = transport.split(";");
  const protocol = parts[0];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const index = part.indexOf("=");

    if (index > -1 && index !== part.length - 1) {
      obj[part.substring(0, index)] = part.substring(index + 1);
    }
  }
  
  return {
    protocol,
    parameters: obj
  };
}

function generateSSRC() {
  return getRandomIntInclusive(1,0xffffffff);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  parseRTPPacket,
  parseRTCPPacket,
  getMD5Hash,
  parseTransport,
  generateSSRC
};
