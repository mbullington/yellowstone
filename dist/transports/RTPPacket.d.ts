/// <reference types="node" />
declare class RTPPacket {
    private bufpkt;
    constructor(bufpayload: Buffer, hasHeader?: boolean);
    get type(): number;
    set type(val: number);
    get seq(): number;
    set seq(val: number);
    get time(): number;
    set time(val: number);
    get source(): number;
    set source(val: number);
    get payload(): Buffer;
    set payload(val: Buffer);
    get packet(): Buffer;
    set packet(val: Buffer);
}
export default RTPPacket;
