"use strict";
// De-packetize RC 6597 RTP packets to re-create SMPTE336M KLV Metadata including STANAG 4609
// Write data to a file as raw binary data.
// The RTP timestamp is not saved to the file.
// By Roger Hardiman, January 2026
Object.defineProperty(exports, "__esModule", { value: true });
class SMPTE336MKLVTransport {
    constructor(client, stream, details) {
        this.client = client;
        this.stream = stream;
        this.rawData = [];
        client.on("data", (channel, data, packet) => {
            if (channel == details.rtpChannel) {
                this.processRTPPacket(packet);
            }
        });
    }
    processRTPPacket(packet) {
        // RTP Payload for ONVIF Metadata
        // Accumulate payload
        this.rawData.push(packet.payload);
        if (packet.marker == 1) { // TODO... OR if the Timestamp has changed
            // end of data. Write the file
            // In this case we can just write each Buffer from the rawData array
            // If we were passing the KLV to a caller, we would concatenate the Buffers in the rawData array first
            for (const buffer of this.rawData) {
                this.stream.write(buffer);
            }
            this.rawData = [];
        }
    }
}
exports.default = SMPTE336MKLVTransport;
//# sourceMappingURL=SMPTE336MKLVTransport.js.map