/// <reference types="node" />
import * as net from "net";
import { EventEmitter } from "events";
declare enum ReadStates {
    SEARCHING = 0,
    READING_RTSP_HEADER = 1,
    READING_RTSP_PAYLOAD = 2,
    READING_RAW_PACKET_SIZE = 3,
    READING_RAW_PACKET = 4
}
declare type Connection = "udp" | "tcp";
declare type Headers = {
    [key: string]: string | number | undefined;
    Session?: string;
    Location?: string;
    CSeq?: number;
    "WWW-Authenticate"?: string;
    Transport?: string;
    Unsupported?: string;
};
declare type Detail = {
    codec: string;
    mediaSource: any;
    transport: any;
    isH264: boolean;
    rtpChannel: any;
    rtcpChannel: any;
};
export default class RTSPClient extends EventEmitter {
    username: string;
    password: string;
    headers: {
        [key: string]: string;
    };
    isConnected: boolean;
    _url?: string;
    _client?: net.Socket;
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
    tcpSocket: net.Socket;
    setupResult: Array<any>;
    constructor(username: string, password: string, headers?: {
        [key: string]: string;
    });
    _netConnect(hostname: string, port: number): Promise<this>;
    connect(url: string, { keepAlive, connection, }?: {
        keepAlive: boolean;
        connection?: Connection;
    }): Promise<Detail[]>;
    request(requestName: string, headersParam?: Headers, url?: string): Promise<{
        headers: Headers;
        mediaHeaders?: string[];
    } | void>;
    respond(status: string, headersParam?: Headers): void;
    play(): Promise<this>;
    pause(): Promise<this>;
    sendAudioBackChannel(audioChunk: Buffer): Promise<void>;
    close(isImmediate?: boolean): Promise<this>;
    _onData(data: Buffer): void;
    _sendInterleavedData(channel: number, buffer: Buffer): void;
    _sendUDPData(host: string, port: number, buffer: Buffer): void;
    _emptyReceiverReport(): Buffer;
    _socketWrite(socket: net.Socket, data: Buffer): Promise<any>;
}
export { RTPPacket, RTCPPacket } from "./util";
