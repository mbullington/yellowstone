"use strict";
// De-packetize RTP packets to re-create AAC High Bit Rate (hbr) Audio
// Write Audio to a .aac file
// By Roger Hardiman, October 2019
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const transform = require("sdp-transform");
class AACTransport {
    constructor(client, stream, details) {
        this.ObjectType = 0;
        this.FrequencyIndex = 0;
        this.ChannelConfiguration = 0;
        this.client = client;
        this.stream = stream;
        client.on("data", (channel, data, packet) => {
            if (channel == details.rtpChannel) {
                this.processRTPPacket(packet);
            }
        });
        // Process the SDP to get the parameters for the AAC audio
        // "profile-level-id=1;mode=AAC-hbr;sizelength=13;indexlength=3;indexdeltalength=3;config=1490"
        // @ts-ignore
        let fmtp = details.mediaSource.fmtp[0];
        const fmtpConfig = transform.parseParams(fmtp.config);
        let bs = new util_1.BitStream();
        bs.AddHexString(fmtpConfig["config"].toString());
        /***
        5 bits: object type
            if (object type == 31)
            6 bits + 32: object type
        4 bits: frequency index
            if (frequency index == 15)
            24 bits: frequency
        4 bits: channel configuration
        var bits: AOT Specific Config
        ***/
        // Read 5 bits
        this.ObjectType = bs.Read(5);
        // Read 4 bits
        this.FrequencyIndex = bs.Read(4);
        // Read 4 bits
        this.ChannelConfiguration = bs.Read(4);
    }
    processRTPPacket(packet) {
        // RTP Payload for MPEG4-GENERIC consis of multiple blocks of data
        // Each block has 3 parts
        // Part 1 - Acesss Unit Header Length + Header
        // Part 2 - Access Unit Auxiliary Data Length + Data (not used in AAC High Bitrate)
        // Part 3 - Access Unit Audio Data
        let rtp_payload = packet.payload;
        let ptr = 0;
        let audio_data = [];
        while (true) {
            if (ptr + 4 > rtp_payload.length)
                break; // 2 bytes for AU Header Length, 2 bytes of AU Header payload
            // Get Size of the AU Header
            let au_headers_length_bits = (rtp_payload[ptr] << 8) + (rtp_payload[ptr + 1] << 0); // 16 bits
            let au_headers_length = Math.ceil(au_headers_length_bits / 8.0);
            ptr += 2;
            // Examine the AU Header. Get the size of the AAC data
            let aac_frame_size = ((rtp_payload[ptr] << 8) + (rtp_payload[ptr + 1] << 0)) >> 3; // 13 bits
            let aac_index_delta = rtp_payload[ptr + 1] & 0x03; // 3 bits
            ptr += au_headers_length;
            // extract the AAC block
            if (ptr + aac_frame_size > rtp_payload.length)
                break; // not enough data to copy
            audio_data.push(rtp_payload.slice(ptr, ptr + aac_frame_size));
            ptr += aac_frame_size;
        }
        // Write Audio Data Transport Stream (adts) header
        // followed by the AAC data
        for (let x = 0; x < audio_data.length; x++) {
            let data = audio_data[x];
            let bs = new util_1.BitStream(); //TODO - we could cache the header bitstream
            bs.AddValue(0xfff, 12); // (a) Start of data
            bs.AddValue(0, 1); // (b) Version ID, 0 = MPEG4
            bs.AddValue(0, 2); // (c) Layer always 2 bits set to 0
            let protection_absent = 1;
            bs.AddValue(protection_absent, 1); // (d) 1 = No CRC
            bs.AddValue(this.ObjectType - 1, 2); // (e) MPEG Object Type / Profile, minus 1
            bs.AddValue(this.FrequencyIndex, 4); // (f)
            bs.AddValue(0, 1); // (g) private bit. Always zero
            bs.AddValue(this.ChannelConfiguration, 3); // (h)
            bs.AddValue(0, 1); // (i) originality
            bs.AddValue(0, 1); // (j) home
            bs.AddValue(0, 1); // (k) copyrighted id
            bs.AddValue(0, 1); // (l) copyright id start
            bs.AddValue(data.length + 7, 13); // (m) AAC data + size of the ASDT header
            bs.AddValue(2047, 11); // (n) buffer fullness ???
            let num_acc_frames = 1;
            bs.AddValue(num_acc_frames - 1, 1); // (o) num of AAC Frames, minus 1
            // If Protection was On [value=0], there would be a 16 bit CRC here
            if (protection_absent == 0)
                bs.AddValue(0xabcd /*Calc CRC()*/, 16); // (p)
            let header = bs.ToArray();
            // write to the aac file
            this.stream.write(header);
            this.stream.write(data);
        }
    }
}
exports.default = AACTransport;
//# sourceMappingURL=AACTransport.js.map