// De-packetize RC 6597 RTP packets to re-create SMPTE336M KLV Metadata including STANAG 4609
// Write data to a file as raw binary data.
// The RTP timestamp is not saved to the file.
// By Roger Hardiman, January 2026

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

  constructor(client: RTSPClient, stream: Writable, details: Details) {
    this.client = client;
    this.stream = stream;
    this.rawData = [];

    client.on("data", (channel, data, packet) => {
      if (channel == details.rtpChannel) {
        this.processRTPPacket(packet);
      }
    });
  }

  processRTPPacket(packet: RTPPacket): void {
    // RTP Payload for ONVIF Metadata

    // Accumulate payload
    this.rawData.push(packet.payload)

    if (packet.marker == 1) {  // TODO... OR if the Timestamp has changed
      // end of data. Write the file
      // In this case we can just write each Buffer from the rawData array
      // If we were passing the KLV to a caller, we would concatenate the Buffers in the rawData array first
      for(const buffer of this.rawData) {
        this.stream.write(buffer);
      }
      this.rawData = [];
    }
  }
}
