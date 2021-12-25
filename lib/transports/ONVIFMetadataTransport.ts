// De-packetize RTP packets to re-create ONVIF Mfetadata
// Write data to a file
// By Roger Hardiman, December 2021

import RTSPClient from "../RTSPClient";
import { RTPPacket, BitStream } from "../util";

import * as transform from "sdp-transform";
import { Writable } from "stream";
import {EOL} from "os";

interface Details {
  codec: string;
  mediaSource: transform.MediaDescription;
  rtpChannel: number;
  rtcpChannel: number;
}

export default class ONVIFMetadataTransport {
  client: RTSPClient;
  stream: Writable;
  xml: string;

  constructor(client: RTSPClient, stream: Writable, details: Details) {
    this.client = client;
    this.stream = stream;
    this.xml = "";

    client.on("data", (channel, data, packet) => {
      if (channel == details.rtpChannel) {
        this.processRTPPacket(packet);
      }
    });
  }

  processRTPPacket(packet: RTPPacket) {
    // RTP Payload for ONVIF Metadata

    // Accumulate payload
    this.xml = this.xml.concat(packet.payload.toString());

    if (packet.marker == 1) {
      // end of xml, write to file
      this.stream.write(this.xml);
      this.stream.write(EOL+EOL);
      this.xml = "";
    }
  }
}
