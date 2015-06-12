export class RTPPacket {
  constructor(buffer) {
    let hasExtensions = (buffer[0] << 3) >>> 7;

    this.id = buffer.readUInt16BE(2);
    this.timestamp = buffer.readUInt32BE(4);
    this.payload = buffer.slice(hasExtensions ? 16 : 12);
    this.length = this.payload.length;
  }
}
