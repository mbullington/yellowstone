// Packetize audio chunk to RTP packets 
// By Thangcq98, August 2022

import { Buffer } from "buffer";

function toUnsigned(val: number): number {
    return ((val >>> 1) * 2 + (val & 1));
}

class RTPPacket {
    private _bufpkt: Buffer; // holds the RTP header (12 bytes) AND the RTP packet payload

    constructor(bufpayload: Buffer, hasHeader = false) {
        /* See RFC3550 for more details: http://www.ietf.org/rfc/rfc3550.txt
        V = 2, // version. always 2 for this RFC (2 bits)
        P = 0, // padding. not supported yet, so always 0 (1 bit)
        X = 0, // header extension (1 bit)
        CC = 0, // CSRC count (4 bits)
        M = 0, // marker (1 bit)
        PT = 0, // payload type. see section 6 in RFC3551 for valid types: http://www.ietf.org/rfc/rfc3551.txt (7 bits)
        SN = Math.floor(1000 * Math.random()), // sequence number. SHOULD be random (16 bits)
        TS = 1, // timestamp in the format of NTP (# sec. since 0h UTC 1 January 1900)? (32 bits)
        SSRC = 1; // synchronization source (32 bits)
        //CSRC = 0, // contributing sources. not supported yet (32 bits)
        //DP = 0, // header extension, 'Defined By Profile'. not supported yet (16 bits)
        //EL = 0; // header extension length. not supported yet (16 bits)
        */
        if (hasHeader && bufpayload.length >= 12) {
            // full packet (generally an incoming packet straight from the socket)
            this._bufpkt = bufpayload;
            /*V = (bufpkt[0] >>> 6 & 0x03);
            P = (bufpkt[0] >>> 5 & 0x01);
            X = (bufpkt[0] >>> 4 & 0x01);
            CC = (bufpkt[0] & 0x0F);
            M = (bufpkt[1] >>> 7 & 0x01);
            PT = (bufpkt[1] & 0x7F);
            SN = (bufpkt[2] << 8 | bufpkt[3]);
            TS = (bufpkt[4] << 24 | bufpkt[5] << 16 | bufpkt[6] << 8 | bufpkt[7]);
            SSRC = (bufpkt[8] << 24 | bufpkt[9] << 16 | bufpkt[10] << 8 | bufpkt[11]);*/
            // bufpkt[12..bufpkg.length-1] == payload data
        } else {
            // just payload data (for outgoing/sending)
            this._bufpkt = new Buffer(12 + bufpayload.length); // V..SSRC + payload
            /*bufpkt[0] = (V << 6 | P << 5 | X << 4 | CC);
            bufpkt[1] = (M << 7 | PT);
            bufpkt[2] = (SN >>> 8)
            bufpkt[3] = (SN & 0xFF);
            bufpkt[4] = (TS >>> 24);
            bufpkt[5] = (TS >>> 16 & 0xFF);
            bufpkt[6] = (TS >>> 8 & 0xFF);
            bufpkt[7] = (TS & 0xFF);
            bufpkt[8] = (SSRC >>> 24);
            bufpkt[9] = (SSRC >>> 16 & 0xFF);
            bufpkt[10] = (SSRC >>> 8 & 0xFF);
            bufpkt[11] = (SSRC & 0xFF);*/
            this._bufpkt[0] = 0x80;
            this._bufpkt[1] = 0;
            const SN = Math.floor(1000 * Math.random());
            this._bufpkt[2] = (SN >>> 8)
            this._bufpkt[3] = (SN & 0xFF);
            this._bufpkt[4] = 0;
            this._bufpkt[5] = 0;
            this._bufpkt[6] = 0;
            this._bufpkt[7] = 1;
            this._bufpkt[8] = 0;
            this._bufpkt[9] = 0;
            this._bufpkt[10] = 0;
            this._bufpkt[11] = 1;
            bufpayload.copy(this._bufpkt, 12, 0); // append payload data
        }
    }

    public get type() { return (this._bufpkt[1] & 0x7F); }
    public set type(val) {
        val = toUnsigned(val);
        if (val <= 127) {
            this._bufpkt[1] -= (this._bufpkt[1] & 0x7F);
            this._bufpkt[1] |= val;
        }
    }

    public get seq() { return (this._bufpkt[2] << 8 | this._bufpkt[3]); }
    public set seq(val) {
        val = toUnsigned(val);
        if (val <= 65535) {
            this._bufpkt[2] = (val >>> 8);
            this._bufpkt[3] = (val & 0xFF);
        }
    }

    public get time() { return (this._bufpkt[4] << 24 | this._bufpkt[5] << 16 | this._bufpkt[6] << 8 | this._bufpkt[7]); }
    public set time(val) {
        val = toUnsigned(val);
        if (val <= 4294967295) {
            this._bufpkt[4] = (val >>> 24);
            this._bufpkt[5] = (val >>> 16 & 0xFF);
            this._bufpkt[6] = (val >>> 8 & 0xFF);
            this._bufpkt[7] = (val & 0xFF);
        }
    }

    public get source() { return (this._bufpkt[8] << 24 | this._bufpkt[9] << 16 | this._bufpkt[10] << 8 | this._bufpkt[11]); }
    public set source(val) {
        val = toUnsigned(val);
        if (val <= 4294967295) {
            this._bufpkt[8] = (val >>> 24);
            this._bufpkt[9] = (val >>> 16 & 0xFF);
            this._bufpkt[10] = (val >>> 8 & 0xFF);
            this._bufpkt[11] = (val & 0xFF);
        }
    }

    // Gets/Sets the payload of an existing RTP packet (without any RTP Headers)
    public get payload() { return (this._bufpkt.slice(12, this._bufpkt.length)); }
    public set payload(val) {
        if (Buffer.isBuffer(val)) {
            const newsize = 12 + val.length;
            if (this._bufpkt.length == newsize)
                val.copy(this._bufpkt, 12, 0);
            else {
                const newbuf = new Buffer(newsize);
                this._bufpkt.copy(newbuf, 0, 0, 12); // copy the RTP header
                val.copy(newbuf, 12, 0);
                this._bufpkt = newbuf;
            }
        }
    }

    // gets/sets the RTP Header and RTP Payload
    public get packet() { return this._bufpkt; }
    public set packet(val) {
        this._bufpkt = val;
    }
}

export default RTPPacket;