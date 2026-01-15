// Process SDP and RTP packets
// De-packetize RTP packets to re-create H266 NAL Units
// Write H266 NAL units to a .266 file

// (c) 2026 Roger Hardiman
// Based on my Yellowstone H265 Parser which in turn is based on my SharpRTSP H265 RTP Parser I wrote in September 2018

import RTSPClient from "../RTSPClient";
import { RTPPacket } from "../util";

import * as transform from "sdp-transform";
import { Writable } from "stream";

// .h266 file header (Annex B)
const H266_HEADER = Buffer.from([0x00, 0x00, 0x00, 0x01]);

interface Details {
  codec: string
  mediaSource: transform.MediaDescription
  rtpChannel: number,
  rtcpChannel: number
}

export default class H266Transport {
  client: RTSPClient;
  stream: Writable;
  has_donl = false; // We have to check the SDP to see if DONL bytes are being set in the RTP packet

  rtpPackets: Buffer[] = [];

  constructor(client: RTSPClient, stream: Writable, details: Details) {
    this.client = client;
    this.stream = stream;

    // process 'fmtp' (which is optional in the SDP)
    this.processConnectionDetails(details);

    client.on("data", (channel, data, packet) => {
      if (channel == details.rtpChannel) {
        this.processRTPPacket(packet);
      }
    });

  }

  processConnectionDetails(details: Details): void {
    // Extract the DCI, VPS, SPS and PPS from the MediaSource part of the SDP.
    // NOTE the H266 RTP standard makes this optional and we may need to extract this from the RTP payload
    // as inband DCI/VPS/SPS/PPS instead
    const fmtp = (details.mediaSource.fmtp)[0];

    if (!fmtp) {
      return;
    }

    const fmtpConfig = transform.parseParams(fmtp.config);
    const dci = ('sprop-dci' in fmtpConfig) ? Buffer.from(fmtpConfig['sprop-dci']?.toString(), "base64") : null;
    const vps = ('sprop-vps' in fmtpConfig) ? Buffer.from(fmtpConfig['sprop-vps']?.toString(), "base64") : null; 
    const sps = ('sprop-sps' in fmtpConfig) ? Buffer.from(fmtpConfig['sprop-sps']?.toString(), "base64") : null;
    const pps = ('sprop-pps' in fmtpConfig) ? Buffer.from(fmtpConfig['sprop-pps']?.toString(), "base64") : null

    if (dci != null) {
      this.stream.write(H266_HEADER);
      this.stream.write(dci);
    }
    if (vps != null) {
      this.stream.write(H266_HEADER);
      this.stream.write(vps);
    }
    if (sps != null) {
      this.stream.write(H266_HEADER);
      this.stream.write(sps);
    }
    if (pps != null) {
      this.stream.write(H266_HEADER);
      this.stream.write(pps);
    }
  }

  processRTPPacket(packet: RTPPacket): void {
    // Accumatate RTP packets
    this.rtpPackets.push(packet.payload);

    // When Marker is set to 1 pass the group of packets to processRTPFrame()
    if (packet.marker == 1) {
      this.processRTPFrame(this.rtpPackets);
      this.rtpPackets = [];

      // Write out the AUD
      this.stream.write(H266_HEADER);
      this.stream.write(Buffer.from([0x00, 0xA1, 0x88]));

    }
  }

  processRTPFrame(rtpPackets: Buffer[]): void {
    const nals = [];
    let partialNal = [];

    for (let i = 0; i < rtpPackets.length; i++) {

      // Examine the first two bytes of the RTP data, the Payload Header
      // F (Forbidden Bit), must be 0
      // Z (Zero Bit), must be 0
      // LayerId (6 bits)
      // Type of NAL Unit (5 bits)
      // TID  (TemporalID = TID - 1)
      /*+---------------+---------------+
        *|0|1|2|3|4|5|6|7|0|1|2|3|4|5|6|7|
        *+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
        *|F|Z| LayerID   |  Type   | TID |
        *+-------------+-----------------+
        */
      const packet = rtpPackets[i];

      const payload_header = (packet[0] << 8) | (packet[1]);
      const payload_header_f_bit = (payload_header >> 15) & 0x01;
      const payload_header_z_bit = (payload_header >> 14) & 0x01;
      const payload_header_layer_id = (payload_header >> 8) & 0x3F;
      const payload_header_type = (payload_header >> 3) & 0x1F;
      const payload_header_tid = payload_header & 0x7;

      // There are three ways to Packetize NAL units into RTP Packets
      //  Single NAL Unit Packet
      //  Aggregation Packet
      //  Fragmentation Unit


      // Note H266/VVC has a concept of a GDR - Gradual Decoder Refresh
      // and of the IDR - Instantaneous Decoding Refresh


      // Single NAL Unit Packet
      if (payload_header_type != 28 && payload_header_type != 29) {
        //TODO - Handle DONL
        nals.push(packet);
      }

      // Aggregation Packet
      else if (payload_header_type == 28) {
        // TODO. This is an Agregation Packet so we need to extract
        // the 2 or more NALs from the packet.
        console.log("eek - we have not implemented Agregation Packets yet");
      }


      // Fragmentation Unit
      else if (payload_header_type == 29) {
        //Console.WriteLine("Fragmentation Unit");

        //    0 1 2 3 4 5 6 7
        //   +-+-+-+-+-+-+-+-+
        //   |S|E|P| FuType  |
        //   +---------------+
        //

        // Parse Fragmentation Unit Header
        const fu_header_s = (packet[2] >> 7) & 0x01;  // start marker
        const fu_header_e = (packet[2] >> 6) & 0x01;  // end marker
        const fu_header_p = (packet[2] >> 5) & 0x01; // P = last FU of a Coded Picture
        const fu_header_type = (packet[2] >> 0) & 0x1F; // fu type (5 bits)

        // Console.WriteLine("Frag FU-A s=" + fu_header_s + "e=" + fu_header_e);

        // Check Start and End flags
        if (fu_header_s == 1 && fu_header_e == 0) {
          // Start Fragment.
          // Initiise the partialNal byte array

          // Empty the partial NAL array
          partialNal = [];

          // Reconstrut the NAL header from the rtp_payload_header, replacing the Type with FU Type
          let nal_header = (payload_header & 0xFF07); // strip out existing 'type' which is the "FU Type"
          nal_header = nal_header | (fu_header_type << 3); // and replace it with the fu_header_type

          partialNal.push((nal_header >> 8) & 0xFF);
          partialNal.push((nal_header >> 0) & 0xFF);
        }


        // Copy the video data
        if (this.has_donl) {
          // start copying after the DONL data
          for (let x = 5; x < packet.length; x++) {
              partialNal.push(packet[x]); // not very efficient, copying one byte at a time
          }
        }
        else {
          // there is no DONL data
          for (let x = 3; x < packet.length; x++) {
            partialNal.push(packet[x]); // not very efficient, copying one byte at a time
          }
        }

        if (fu_header_s == 0 && fu_header_e == 1) {
          // End Fragment
          // Append this payload to the fragmented_nal

          // Add the NAL to the array of NAL units
          nals.push(Buffer.from(partialNal));
        }
      }
      else {
        //Console.WriteLine("Unknown Payload Header Type = " + payload_header_type);
      }
    }

    // Write out all the NALs
    for (let x = 0; x < nals.length; x++) {
      this.stream.write(H266_HEADER);
      this.stream.write(nals[x]);
    }
  }
}
