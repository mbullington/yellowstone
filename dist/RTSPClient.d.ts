/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as net from "net";
import { EventEmitter } from "events";
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
    setupResult: Array<Detail>;
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
    play(): Promise<void>;
    pause(): Promise<void>;
    sendAudioBackChannel(audioChunk: Buffer): Promise<void>;
    close(isImmediate?: boolean): Promise<void>;
    _onData(data: Buffer): void;
    _sendInterleavedData(channel: number, buffer: Buffer): void;
    _sendUDPData(host: string, port: number, buffer: Buffer): void;
    _emptyReceiverReport(): Buffer;
    _socketWrite(socket: net.Socket, data: Buffer): Promise<any>;
}
export { RTPPacket, RTCPPacket } from "./util";
