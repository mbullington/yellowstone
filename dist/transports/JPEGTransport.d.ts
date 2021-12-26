/// <reference types="node" />
import RTSPClient from "../RTSPClient";
import { RTPPacket } from "../util";
import * as transform from "sdp-transform";
interface Details {
    codec: string;
    mediaSource: transform.MediaDescription;
    rtpChannel: number;
    rtcpChannel: number;
}
export default class JPEGTransport {
    client: RTSPClient;
    filename: string;
    jpegSeq: number;
    rtpPackets: Buffer[];
    _headerWritten: boolean;
    constructor(client: RTSPClient, filename: string, details: Details);
    processRTPPacket(packet: RTPPacket): void;
    processRTPFrame(rtpPackets: Buffer[]): null | undefined;
    /**
     * references:
     * https://entelijan.net/svn1/javaprj/experimental/jmf/src/com/sun/media/codec/video/jpeg/RTPDePacketizer.java
     * https://tools.ietf.org/html/rfc2435
     */
    lum_dc_codelens: number[];
    lum_dc_symbols: number[];
    lum_ac_codelens: number[];
    lum_ac_symbols: number[];
    chm_dc_codelens: number[];
    chm_dc_symbols: number[];
    chm_ac_codelens: number[];
    chm_ac_symbols: number[];
    makeHuffmanHeader(codelens: number[], symbols: number[], tableNo: number, tableClass: number): number[];
    makeDRIHeader(dri: number): number[];
    jpeg_luma_quantizer: number[];
    jpeg_chroma_quantizer: number[];
    makeTables(q: number): number[][];
    makeQuantTables(tables: Buffer, precision: number): number[];
    makeHeaders(type: number, q: number, w: number, h: number, precision: number, quantTables: Buffer, restartInterval: number): (number | number[])[];
}
export {};
