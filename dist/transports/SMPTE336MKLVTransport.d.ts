/// <reference types="node" />
/// <reference types="node" />
import RTSPClient from "../RTSPClient";
import { RTPPacket } from "../util";
import * as transform from "sdp-transform";
import { Writable } from "stream";
interface Details {
    codec: string;
    mediaSource: transform.MediaDescription;
    rtpChannel: number;
    rtcpChannel: number;
}
export default class SMPTE336MKLVTransport {
    client: RTSPClient;
    stream: Writable;
    rawData: Buffer[];
    constructor(client: RTSPClient, stream: Writable, details: Details);
    processRTPPacket(packet: RTPPacket): void;
}
export {};
