export function parseRTPPacket(buffer) {
  const hasExtensions = (buffer[0] << 3) >>> 7;

  const payload = buffer.slice(hasExtensions ? 16 : 12);
  const { length } = payload;

  return {
    id: buffer.readUInt16BE(2),
    timestamp: buffer.readUInt32BE(4),
    payload,
    length
  };
}
