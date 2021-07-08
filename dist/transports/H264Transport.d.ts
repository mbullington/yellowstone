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
export default class H264Transport {
    client: RTSPClient;
    stream: Writable;
    rtpPackets: Buffer[];
    _headerWritten: boolean;
    constructor(client: RTSPClient, stream: Writable, details: Details);
    processConnectionDetails(details: Details): void;
    processRTPPacket(packet: RTPPacket): void;
    processRTPFrame(rtpPackets: Buffer[]): void;
}
export {};
