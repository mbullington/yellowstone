const { RtspClient } = require("./index.js");

// RTSP client with onvif extensions.
class OnvifRtspClient extends RtspClient {
  constructor(username, password) {
    super(username, password, { Require: "onvif-replay" });
  }

  play(from, to) {
    const obj = {
      Session: this_session,
      Immediate: 'yes'
    };

    if (from) {
      obj.Range = `clock=${from.toISOString()}-`;
      if (to) {
        obj.Range += to.toISOString();
      }
    }

    return this.request("PLAY", obj).then(() => this);
  }

  reverse(from, to) {
    const obj = {
      Session: this_session,
      'Rate-Control': 'no',
      Scale: '-1.0'
    };

    if (from) {
      obj.Range = `clock=${from.toISOString()}-`;
      if (to) {
        obj.Range += to.toISOString();
      }
    }

    return this.request("PLAY", obj).then(() => this);
  }
}

module.exports = { OnvifRtspClient };