yellowstone 1.0.0
===

```
npm install yellowstone --save
```

Yellowstone is a high-level library for receiving data from RTSP/RTP. It
currently only supports RTSP/RTP over TCP. Yellowstone makes no attempt to parse
or convert any of the raw data it receives, and puts that weight on the
library user itself for the time being.

Yellowstone is written in ES6, so you'll need to use `gulp build` if you plan
on using it with ES5, or you can use Yellowstone precompiled from npm.

Contributing
===

Please contribute features! This is a very small subset of what's possible
with RTSP/RTP! Feel free to write and submit pull requests for easy to use
abstractions of protocol extensions (such as lib/onvif.js), as well as core
features and bug fixes.

Examples
===

An example of most of the API can be found at examples/wowza.js.

TODO
===

- Add APIs to access RTCP.
- Implement *RECORD* and *ANNOUNCE*.
- Aim for better support of the entire RTSP specification.
