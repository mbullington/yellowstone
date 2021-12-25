"use strict";
// De-packetize RTP packets to re-create ONVIF Mfetadata
// Write data to a file
// By Roger Hardiman, December 2021
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
class ONVIFMetadataTransport {
    constructor(client, stream, details) {
        this.client = client;
        this.stream = stream;
        this.xml = "";
        client.on("data", (channel, data, packet) => {
            if (channel == details.rtpChannel) {
                this.processRTPPacket(packet);
            }
        });
    }
    processRTPPacket(packet) {
        // RTP Payload for ONVIF Metadata
        // Accumulate payload
        this.xml = this.xml.concat(packet.payload.toString());
        if (packet.marker == 1) {
            // end of xml, write to file
            this.stream.write(this.xml);
            this.stream.write(os_1.EOL + os_1.EOL);
            this.xml = "";
        }
    }
}
exports.default = ONVIFMetadataTransport;
//# sourceMappingURL=ONVIFMetadataTransport.js.map