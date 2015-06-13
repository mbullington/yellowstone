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

Yellowstone does currently support:

- Raw RTP/AVP over TCP
- Basic and Digest Authentication
- Pause, Play, and Teardown (Close)
- Wrapper for ONVIF extensions to RTSP

In the future, Yellowstone plans to support:

- RTCP
- Record and Announce Methods
- Full Client RTSP support
- Basic scriptable RTSP server (which also allows for unit tests)

Examples
===

An example of most of the API can be found at examples/wowza.js.

```js
var RtspClient = require('yellowstone').RtspClient;

var client = new RtspClient();

// details is a plain Object that includes...
// format - string
client.connect('rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov').then(function(details) {
  client.play();
}).catch(function(err) {
  console.log(err.stack);
});

// data == packet.payload, just a small convenient thing
client.on('data', function(data, packet) {
  console.log(data.length);
});

// allows you to optionally allow for RTSP logging
// also allows for you to hook this into your own logging system easily
client.on('log', function(data, prefix) {
  console.log(prefix + ': ' + data);
});
```

Contributing
===

Please contribute features! This is a very small subset of what's possible
with RTSP/RTP! Feel free to write and submit pull requests for easy to use
abstractions of protocol extensions (such as lib/onvif.js), as well as core
features and bug fixes.

License
===

You can just read the LICENSE file, or npm. It's MIT.
