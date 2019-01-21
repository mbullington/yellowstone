import RTSPClient from "./RTSPClient";

// RTSP client with ONVIF extensions.
export default class ONVIFClient extends RTSPClient {
  constructor(username: string, password: string) {
    super(username, password, { Require: "onvif-replay" });
  }

  async playFrom(from: Date, to?: Date) {
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

  async playReverse(from?: Date, to?: Date) {
    const obj: any = {
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
