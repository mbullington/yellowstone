// Handle AV1 Video
// Process SDP and RTP packets
// De-packetize RTP packets to re-create AV1 OBUs
// Write AV1 OBUs to a .obu file which can be played with "ffplay"
//
// By Roger Hardiman, May 2025

import RTSPClient from "../RTSPClient";
import { RTPPacket } from "../util";

import * as transform from "sdp-transform";
import { Writable } from "stream";

interface Details {
  codec: string
  mediaSource: transform.MediaDescription
  rtpChannel: number,
  rtcpChannel: number
}

export default class AV1Transport {
  client: RTSPClient;
  stream: Writable;

  rtpPackets: Buffer[] = [];
  waitingForSequenceHeader = true; // used when writing .obu file as 'ffplay' does not like it if the first OBUs are not TD then SH

  constructor(client: RTSPClient, stream: Writable, details: Details) {
    this.client = client;
    this.stream = stream;

    // process 'fmtp'
    this.processConnectionDetails(details);

    client.on("data", (channel, data, packet) => {
      if (channel == details.rtpChannel) {
        this.processRTPPacket(packet);
      }
    });

  }

  processConnectionDetails(details: Details): void {
    // There is no Sequence Header (the extra_data / parameter set) in the SDP of AV1
    // and currently we have no use for profile, level-idx or tier
    const fmtp = (details.mediaSource.fmtp)[0];

    if (!fmtp) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fmtpConfig = transform.parseParams(fmtp.config);

    /*
    const _profile = fmtpConfig['profile'].toString();
    const _level_idx = fmtpConfig['level-idx'].toString();
    const _tier = fmtpConfig['tier'].toString();
    */
  }

  processRTPPacket(packet: RTPPacket): void {
    // Accumatate RTP packets
    this.rtpPackets.push(packet.payload);

    // When Marker is set to 1 pass the group of packets to processRTPFrame()
    if (packet.marker == 1) {
      this.processRTPFrame(this.rtpPackets);
      this.rtpPackets = [];
    }
  }

  processRTPFrame(rtpPackets: Buffer[]): void {
    const obus: Buffer[] = []; // the OBUs from the RTSP server, which normally come without their length bytes (leb128) 
    
    for (let i = 0; i < rtpPackets.length; i++) {

      // The RTP packet can contain more than one OBU element

      // Examine the first byte of the RTP data, the Aggregation Header.
      // Z = 1 Indicates that the first OBU element in this RTP packet is a contination of the last OBU element from the last packet (ie fragmentation)
      // Y = 1 Indicates that the last OBU element in this RTP packet will be fragmented and will continue in the next RTP packet (so next RTP packet will have Z=1)
      
      // W = Number of OBU elements in this RTP Packet, or 0 if the number of OBUs is not given
      // If W = 0, all OBU elements are prefixed with a LEB128 length.
      // If W > 0, the OBU elements _except the last one_ have a LEB128 length prefix. Last OBU has no LEB128 length prefix. It can be computed from the RTP payload size

      // N = 1 Indicates first packet of a Coded Video Sequence

      // 0 1 2 3 4 5 6 7
      // +-+-+-+-+-+-+-+-+
      // |Z|Y| W |N|-|-|-|
      // +-+-+-+-+-+-+-+-+
      const packet = rtpPackets[i];

      let ptr = 0;
      const aggregation_header = packet[ptr];
      ptr++
      const aggregation_header_z_bit = (aggregation_header >> 7) & 0x01;
      //const aggregation_header_y_bit = (aggregation_header >> 6) & 0x01;
      const aggregation_header_w = (aggregation_header >> 4) & 0x03;
      //const aggregation_header_n_bit = (aggregation_header >> 3) & 0x01;

      /*
      if (aggregation_header_z_bit == 1) {
        console.log("AV1 Z Fragmentation");
      }
      if (aggregation_header_y_bit == 1) {
        console.log("AV1 Y Fragmentation");
      }
      if (aggregation_header_n_bit == 1) {
        console.log("AV1 N Bit is set");
      }
      */

      let obuCount = 0;

        // Loop over each OBU
        while (ptr < packet.length) {

          obuCount++;

          // Check if the OBU element will be prefixed with a LEB128 length
          let hasLeb128Prefix = false;
          if (aggregation_header_w == 0) hasLeb128Prefix = true;
          if (aggregation_header_w != 0 && obuCount != aggregation_header_w) hasLeb128Prefix = true;

          let obu_element_size = 0;
          if (hasLeb128Prefix) {
            for (let i = 0; i < 8; i++) { // max 8 bytes
              const lebByte = packet[ptr];
              ptr++;

              obu_element_size = obu_element_size + ((lebByte & 0x7F) << (i * 7));

              if ((lebByte & 0x80) == 0) {
                // finished
                break;
              }
            }
          } else {
            // no LEB128. Size is the remaining bytes
            obu_element_size = packet.length - ptr;
          }

          // Extract the OBU
          let obu = packet.slice(ptr, ptr + obu_element_size);
          ptr = ptr + obu_element_size;

          // Check Z bit. If Z = 1 we need to append the new OBU data to the Partial OBU data (fragmented data) from the last RTP packet
          if (aggregation_header_z_bit == 1 && obuCount == 1) {
            // Pop off the last 'partial' OBU
            const lastPartialObu = obus.pop();
            if (lastPartialObu == undefined) {
              // error. We do not have any partial data to append this new OBU data to so drop the new OBU.
            } else {
              const combinedObuData = Buffer.concat([
                lastPartialObu,
                obu
              ]);
              obu = combinedObuData;
            }
          }

          // We have an OBU so store it
          // Note if 'Y' is set, and we are processing the last OBU in the RTP packet, the data will be only part of the fragmented data
          // but we don't check the Y bit. We rely on the Z bit being set to 1 in the next RTP packet
          if (obu.length > 0) {
            obus.push(obu);
          }
      } // Ptr now parsed all OBU elements in this RTP packet


    } // end for-each RTP packet in the Frame


    // Write out all the OBUs
    // When we write to a File, we need to add the Temporal Delimiter (TD)
    // and then the SEQUENCE_HEADER (SH)
    // and then the other OBUs.
    // The OBUs are modified to include a LEB128 size as required in the AV1 File Format Spec Section 5 file format
    // The modification is needed as the AV1 RTSP Spec strips out the OBU lengths and replaces them with OBU Prefix lengths
    // which come before the OBU instead of inside the OBU.
    // There is an Annex B format that keeps the length bytes as prefixes on the OBU (instead of inside them) but I've not implemented that

    // Check if this Frame includes a Sequence Header
    if (this.waitingForSequenceHeader) {
      for (const obu of obus) {
        const obuHeader = obu[0];
        const obu_type = (obuHeader >> 3) & 0x0F;
        if (obu_type == 1) { // Sequence Header
          this.waitingForSequenceHeader = false;
          break;
        }
      }
    }

    if (this.waitingForSequenceHeader) {
      // drop this RTP frame
      console.log("AV1: Waiting for Sequence Header")
    }
    else
    {
      // Write the OBUs
      const temporalDelimiter = Buffer.from([0x12, 0x00]);
      this.stream.write(temporalDelimiter);
      
      for (const obu of obus) {

        // Take a look at the OBU and see what it contains to verify it looks correct
        // OBU Header Byte
        // --------------------------------------------------------------------------------
        // |      7        |  6,5,4,3     |        2         |      1      |      0       |
        // |1 bit forbidden|4 bit OBU Type|1 bit hasExtension|1 bit hasSize|1 bit reserved|
        // --------------------------------------------------------------------------------
        if (obu.length > 0) {
          const obuHeader = obu[0];
          //const forbidden_bit = (obuHeader >> 7) & 0x01;
          const obu_type = (obuHeader >> 3) & 0x0F;
          const extension_bit = (obuHeader >> 2) & 0x01;
          const size_bit = (obuHeader >> 1) & 0x01;

          /*
          const obu_name = this.GetOBUName(obu_type);
          console.log("Found AV1 OBU:" + obu_name);

          if (forbidden_bit == 1) {
            console.log("OBU Forbidden Bit Error");
          }
          
          if (obu_name == "Reserved") {
            console.log("OBU Type Error");
          }
          */

          if (this.waitingForSequenceHeader) {
            if (obu_type == 1) {
              this.waitingForSequenceHeader = false;

              // Write the First TD


            } else {
              // we are still waiting so drop this OBU
              console.log("AV1 file writing: Dropping OBU while waiting for Sequence Header")
              continue;
            }
          }
            

          // In order to write to a .obu file, we have to ensure there is a LEB128 Size after the OBU Header Byte (and Optional Extension Byte)
          // The LEB128 length gets stripped out in RTP packets
          if (size_bit == 0) {
            let size = 0;
            if (extension_bit == 0) size = obu.length - 1; // -1 for the OBU header
            if (extension_bit == 1) size = obu.length - 2; // -2 for the OBU header and the Header Extension Byte
            
            // Convert the Size into a LEB128 byte sequence
            const leb128_bytes = [];
            while (size > 0) {
              const lower_7_bits = (size & 0x7F);
              if (size <= 127) {
                leb128_bytes.push(lower_7_bits); // leave msbit as 0
              } else {
                leb128_bytes.push(0x80 + lower_7_bits); // set msbit to 1
              }
              size = (size >> 7);
            }
            const leb128Buffer = Buffer.from(leb128_bytes);

            // Insert the leb128 size into the OBU
            const header_and_extention_len = (extension_bit == 0 ? 1 : 2); // length of header PLUS extension
            // Insert the LEB128 length
            const newObu = Buffer.concat([
              obu.slice(0, 0 + header_and_extention_len),
              leb128Buffer,
              obu.slice(header_and_extention_len,obu.length)
            ]);
            // Set the hasSize flag to '1' in the OBU Header
            newObu[0] = newObu[0] | 0x02;

            // WRITE DATA
            this.stream.write(newObu);
          }
          else
          {
            // This OBU came with a LEB128 length. The AV1 RTSP Spec says the RTSP server should strip them out, but this
            // handles the case where a RTSP Server leaves them in
            // WRITE DATA
            this.stream.write(obu);
          }
        }
      } // for-each OBU in OBUs Arrau
    }
  }


  GetOBUName(obu_type: number): string {
    switch (obu_type)
    {
        case 0: return "Reserved";
        case 1: return "SEQUENCE_HEADER";
        case 2: return "TEMPORAL_DELIMITER";
        case 3: return "FRAME_HEADER";
        case 4: return "TILE_GROUP";
        case 5: return "METADATA";
        case 6: return "FRAME";
        case 7: return "REDUNDANT_FRAME_HEADER";
        case 8: return "TILE_LIST";
        case 9: return "Reserved";
        case 10: return "Reserved";
        case 11: return "Reserved";
        case 12: return "Reserved";
        case 13: return "Reserved";
        case 14: return "Reserved";
        case 15: return "PADDING";
    }

    return "Error getting OBU Type";
  }
}
