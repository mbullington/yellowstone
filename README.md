yellowstone v2.1.0
===

```
npm install yellowstone --save
```

Yellowstone is a high-level library for receiving data from RTSP/RTP. It
currently only supports RTSP/RTP over TCP. Yellowstone makes no attempt to parse
or convert any of the raw data it receives, and puts that weight on the
library user itself for the time being.

Yellowstone does currently support:

- Raw RTP/AVP over TCP
- Basic and Digest Authentication
- Pause, Play, and Teardown (Close)
- Wrapper for ONVIF extensions to RTSP
- Basic RTCP parsing

In the future, Yellowstone plans to support:

- Record and Announce Methods
- Full Client RTSP support
- Basic scriptable RTSP server (which also allows for unit tests)

Examples
===

An example of most of the API can be found at examples/wowza.js.

Contributing
===

Please contribute features! This is a very small subset of what's possible
with RTSP/RTP! Feel free to write and submit pull requests for easy to use
abstractions of protocol extensions (such as lib/onvif.js), as well as core
features and bug fixes.