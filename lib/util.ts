import { createHash } from "crypto";
import { spawn } from "child_process";

export interface RTPPacket {
  id: number;
  timestamp: number;
  marker: number;

  payload: Buffer;
  length: number;
}

export function parseRTPPacket(buffer: Buffer): RTPPacket {
  const hasExtensions = (buffer[0] >> 4) & 0x01;
  const marker = (buffer[1]) >>> 7;
  const num_csrc_identifiers = (buffer[0] & 0x0F);

  const payload = buffer.slice((num_csrc_identifiers * 4) + (hasExtensions ? 16 : 12));
  const { length } = payload;

  return {
    id: buffer.readUInt16BE(2),
    timestamp: buffer.readUInt32BE(4),
    marker,
    payload,
    length
  };
}

export interface RTCPPacket {
  timestamp: number;
  packetType: number;

  buffer: Buffer;
}

export function parseRTCPPacket(buffer: Buffer): RTCPPacket {
  const packetType = buffer[1];
  const timestamp = buffer.readUInt32BE(16);

  return {
    timestamp,
    packetType,
    buffer
  };
}

// utility function for using crypto library
export function getMD5Hash(str: string): string {
  const md5 = createHash("md5");
  md5.update(str);

  return md5.digest("hex");
}

interface Transport {
  protocol: string;
  parameters: { [key: string]: string };
}

export function parseTransport(transport: string): Transport {
  const parameters: { [key: string]: string } = {};

  const parts = transport.split(";");
  const protocol = parts[0];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const index = part.indexOf("=");

    if (index > -1 && index !== part.length - 1) {
      parameters[part.substring(0, index)] = part.substring(index + 1);
    }
  }
  
  return {
    protocol,
    parameters
  };
}

export function randInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSSRC(): number {
  return randInclusive(1, 0xffffffff);
}