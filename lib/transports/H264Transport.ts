// Process SDP and RTP packets
// De-packetize RTP packets to re-create H264 NAL Units
// Write H264 NAL units to a .264 file

import RTSPClient from "../RTSPClient";
import {RTPPacket} from "../util";

import * as transform from "sdp-transform";
import { Writable } from "stream";

// .h264 file header
const H264_HEADER = Buffer.from([0x00,0x00,0x00,0x01]);

interface Details {
  mediaSource: transform.MediaDescription
};

export default class H264Transport {
  client: RTSPClient;
  stream: Writable;

  rtpPackets: Buffer[] = [];

  _headerWritten: boolean = false;

  constructor(client: RTSPClient, stream: Writable, details?: Details) {
    this.client = client;
    this.stream = stream;

    client.on("data", (channel, data, packet) => {
      if (this._headerWritten) {
        this.processRTPPacket(packet);
      }
    });

    if (details != null) {
      this.processConnectionDetails(details);
    }
  }

  processConnectionDetails(details: Details) {
    // Extract SPS and PPS from the MediaSource part of the SDP
    const fmtp = (details.mediaSource.fmtp as any)[0];
    
    if (!fmtp) {
      return;
    }
  
    const fmtpConfig = transform.parseParams(fmtp.config);
    const splitSpropParameterSets = fmtpConfig['sprop-parameter-sets'].toString().split(',');
    const sps_base64 = splitSpropParameterSets[0];
    const pps_base64 = splitSpropParameterSets[1];
    const sps = new Buffer(sps_base64, "base64");
    const pps = new Buffer(pps_base64, "base64");

    this.stream.write(H264_HEADER);
    this.stream.write(sps);
    this.stream.write(H264_HEADER);
    this.stream.write(pps);

    this._headerWritten = true;
  };

  processRTPPacket(packet: RTPPacket) {
    // Accumatate RTP packets
    this.rtpPackets.push(packet.payload);
    
    // When Marker is set to 1 pass the group of packets to processRTPFrame()
    if (packet.marker == 1) {
      this.processRTPFrame(this.rtpPackets);
      this.rtpPackets = [];
    }
  }

  processRTPFrame(rtpPackets: Buffer[]) {
    const nals = [];
    let partialNal = [];

    for (let i = 0; i < rtpPackets.length; i++) {
      const packet = rtpPackets[i];
      const nal_header_f_bit = (packet[0] >> 7) & 0x01;
      const nal_header_nri = (packet[0] >> 5) & 0x03;
      const nal_header_type = (packet[0] >> 0) & 0x1F;

      if (nal_header_type >= 1 && nal_header_type <= 23) { // Normal NAL. Not fragmented
        nals.push(packet);
      } else if (nal_header_type == 24) { // Aggregation type STAP-A. Multiple NAls in one RTP Packet
        let ptr = 1; // start after the nal_header_type which was '24'
        // if we have at least 2 more bytes (the 16 bit size) then consume more data
        while (ptr + 2 < (packet.length - 1)) {
          let size = (packet[ptr] << 8) + (packet[ptr + 1] << 0);
          ptr = ptr + 2;
          nals.push(packet.slice(ptr,ptr+size));
          ptr = ptr + size;
        }
      } else if (nal_header_type == 25) { // STAP-B
        // Not supported
      } else if (nal_header_type == 26) { // MTAP-16
        // Not supported
      } else if (nal_header_type == 27) { // MTAP-24
        // Not supported
      } else if (nal_header_type == 28) { // Frag FU-A
        // NAL is split over several RTP packets
        // Accumulate them in a tempoary buffer
        // Parse Fragmentation Unit Header
        const fu_header_s = (packet[1] >> 7) & 0x01;  // start marker
        const fu_header_e = (packet[1] >> 6) & 0x01;  // end marker
        const fu_header_r = (packet[1] >> 5) & 0x01;  // reserved. should be 0
        const fu_header_type = (packet[1] >> 0) & 0x1F; // Original NAL unit header

        // Check Start and End flags
        if (fu_header_s == 1 && fu_header_e == 0) { // Start of Fragment}
          const reconstructed_nal_type = (nal_header_f_bit << 7)
                                        + (nal_header_nri << 5)
                                        + fu_header_type;
          partialNal = [];
          partialNal.push(reconstructed_nal_type);

          // copy the rest of the RTP payload to the temp buffer
          for (let x=2; x< packet.length;x++) partialNal.push(packet[x]);
        }

        if (fu_header_s == 0 && fu_header_e == 0) { // Middle part of fragment}
          for (let x=2; x< packet.length;x++) partialNal.push(packet[x]);
        }

        if (fu_header_s == 0 && fu_header_e == 1) { // End of fragment}
          for (let x=2; x< packet.length;x++) partialNal.push(packet[x]);
          nals.push(Buffer.from(partialNal));
        }
      } else if (nal_header_type == 29) { // Frag FU-B
        // Not supported
      }
    }

    // Write out all the NALs
    for (let x = 0; x < nals.length; x++) {
        this.stream.write(H264_HEADER);
        this.stream.write(nals[x]);
    }
  }
}
