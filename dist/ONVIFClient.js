"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RTSPClient_1 = require("./RTSPClient");
// RTSP client with ONVIF extensions.
class ONVIFClient extends RTSPClient_1.default {
    constructor(username, password) {
        super(username, password, { Require: "onvif-replay" });
    }
    async playFrom(from, to) {
        const obj = {
            Session: this._session,
            Immediate: 'yes',
            Range: `clock=${from.toISOString()}-`
        };
        if (to) {
            obj.Range += to.toISOString();
        }
        await this.request("PLAY", obj);
        return this;
    }
    async playReverse(from, to) {
        const obj = {
            Session: this._session,
            'Rate-Control': 'no',
            Scale: '-1.0'
        };
        if (from) {
            obj.Range = `clock=${from.toISOString()}-`;
            if (to) {
                obj.Range += to.toISOString();
            }
        }
        await this.request("PLAY", obj);
        return this;
    }
}
exports.default = ONVIFClient;
//# sourceMappingURL=ONVIFClient.js.map