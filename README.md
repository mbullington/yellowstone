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

An example of most API features can be found at examples/wowza.js, which will create
a file named bigbuckbunny.264 in the project's root directory. To test this file with a
video player, you either need a video player that supports raw H264 frames, or wrap it
in a container like MP4.

While yellowstone is /**not**/ dependent on ffmpeg, converting the file to an .mp4 can be easily
accomplished with the following command.

```sh
ffmpeg -f h264 -i bigbuckbunny.264 bigbuckbunny.mp4
```

If you wish to play the H264 file directly, I've had good experience personally with the IINA
video player for macOS.

Contributing
===

Please contribute features! This is a very small subset of what's possible
with RTSP/RTP! Feel free to write and submit pull requests for easy to use
abstractions of protocol extensions (such as lib/onvif.js), as well as core
features and bug fixes.