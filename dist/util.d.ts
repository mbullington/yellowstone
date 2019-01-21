/// <reference types="node" />
export interface RTPPacket {
    id: number;
    timestamp: number;
    marker: number;
    payload: Buffer;
    length: number;
}
export declare function parseRTPPacket(buffer: Buffer): RTPPacket;
export interface RTCPPacket {
    timestamp: number;
    packetType: number;
    buffer: Buffer;
}
export declare function parseRTCPPacket(buffer: Buffer): RTCPPacket;
export declare function getMD5Hash(str: string): string;
interface Transport {
    protocol: string;
    parameters: {
        [key: string]: string;
    };
}
export declare function parseTransport(transport: string): Transport;
export declare function randInclusive(min: number, max: number): number;
export declare function generateSSRC(): number;
export {};
