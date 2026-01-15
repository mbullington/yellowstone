/// <reference types="node" />
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
export default class H265Transport {
    client: RTSPClient;
    stream: Writable;
    has_donl: boolean;
    rtpPackets: Buffer[];
    constructor(client: RTSPClient, stream: Writable, details: Details);
    processConnectionDetails(details: Details): void;
    processRTPPacket(packet: RTPPacket): void;
    processRTPFrame(rtpPackets: Buffer[]): void;
}
export {};
