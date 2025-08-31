/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as net from "net";
import * as tls from "tls";
type SocketUnion = net.Socket | tls.TLSSocket;
import { EventEmitter } from "events";
import * as util from "./util";
import { Transport } from "./util";
import * as transform from "sdp-transform";
declare enum ReadStates {
    SEARCHING = 0,
    READING_RTSP_HEADER = 1,
    READING_RTSP_PAYLOAD = 2,
    READING_RAW_PACKET_SIZE = 3,
    READING_RAW_PACKET = 4
}
type Connection = "udp" | "tcp";
type Headers = {
    [key: string]: string | number | undefined;
    Session?: string;
    Location?: string;
    CSeq?: number;
    "WWW-Authenticate"?: string;
    Transport?: string;
    Unsupported?: string;
};
type Detail = {
    codec: string;
    mediaSource: ({
        type: string;
        port: number;
        protocol: string;
        payloads?: string | undefined;
    } & transform.MediaDescription);
    transport: Transport['parameters'];
    isH264: boolean;
    rtpChannel: number;
    rtcpChannel: number;
    sr_ntpMSW?: number;
    sr_ntpLSW?: number;
    sr_rtptimestamp?: number;
};
export default class RTSPClient extends EventEmitter {
    username: string;
    password: string;
    headers: {
        [key: string]: string;
    };
    isConnected: boolean;
    closed: boolean;
    _url?: string;
    _client?: SocketUnion;
    _cSeq: number;
    _unsupportedExtensions?: string[];
    _session?: string;
    _keepAliveID?: NodeJS.Timeout;
    _nextFreeInterleavedChannel: number;
    _nextFreeUDPPort: number;
    readState: ReadStates;
    messageBytes: number[];
    rtspContentLength: number;
    rtspStatusLine: string;
    rtspHeaders: Headers;
    rtspPacketLength: number;
    rtspPacket: Buffer;
    rtspPacketPointer: number;
    clientSSRC: number;
    tcpSocket: SocketUnion;
    setupResult: Array<Detail>;
    constructor(username: string, password: string, headers?: {
        [key: string]: string;
    });
    _netConnect(hostname: string, port: number, secure?: boolean): Promise<this>;
    connect(url: string, { keepAlive, connection, secure, }?: {
        keepAlive: boolean;
        connection?: Connection;
        secure: boolean;
    }): Promise<Detail[]>;
    request(requestName: string, headersParam?: Headers, url?: string): Promise<{
        headers: Headers;
        mediaHeaders?: string[];
    } | void>;
    respond(status: string, headersParam?: Headers): void;
    play(): Promise<void>;
    pause(): Promise<void>;
    sendAudioBackChannel(audioChunk: Buffer): Promise<void>;
    close(isImmediate?: boolean): Promise<void>;
    _onData(data: Buffer): void;
    _sendInterleavedData(channel: number, buffer: Buffer): void;
    _sendUDPData(host: string, port: number, buffer: Buffer): void;
    _emptyReceiverReport(): Buffer;
    _socketWrite(socket: SocketUnion, data: Buffer): Promise<any>;
    ntpBaseDate_ms: number;
    GetWallClockTime(packet: util.RTPPacket, detail: Detail): Date | undefined;
}
export { RTPPacket, RTCPPacket } from "./util";
