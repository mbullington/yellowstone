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
export default class AV1Transport {
    client: RTSPClient;
    stream: Writable;
    rtpPackets: Buffer[];
    waitingForSequenceHeader: boolean;
    constructor(client: RTSPClient, stream: Writable, details: Details);
    processConnectionDetails(details: Details): void;
    processRTPPacket(packet: RTPPacket): void;
    processRTPFrame(rtpPackets: Buffer[]): void;
    GetOBUName(obu_type: number): string;
}
export {};
