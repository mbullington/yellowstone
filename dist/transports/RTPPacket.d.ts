/// <reference types="node" />
declare class RTPPacket {
    _bufpkt: Buffer;
    type: number;
    seq: number;
    time: number;
    source: number;
    payload: Buffer;
    packet: Buffer;
    constructor(bufpayload: Buffer);
}
export default RTPPacket;
