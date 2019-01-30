yellowstone v3.0.1
===

[![NPM](https://img.shields.io/npm/v/yellowstone.svg)](https://www.npmjs.com/package/yellowstone)

The RTP/RTSP client for Node.js.

```
npm install yellowstone --save
```

## Getting Started

Yellowstone is a library to receive raw data from RTSP/RTP. The library (at this time) makes little attempt to parse the raw data it receives, and puts that weight on the
library user themselves. Transports (such as for H264) may be suitable as-is or as a starting point for your own work.

Yellowstone was co-developed by Michael Bullington and Roger Hardiman.

## Current Features

- Raw RTP/AVP via UDP & TCP (interleaved)
  * Basic and Digest Authentication
  * Pause, Play, and Teardown (Close)
- Simple RTCP parsing
- Simple H264 transport parsing
- ONVIF extensions to RTSP

In the future, Yellowstone plans to support:

- Record and Announce Methods
- Full Client RTSP support

## Examples

An example of most API features can be found at [examples/wowza.js](examples/wowza.js), which will create
a file named bigbuckbunny.264 in the project's root directory. To test this file with a
video player, you either need a video player that supports raw H264 frames, or wrap it
in a container like MP4.

While yellowstone is /**not**/ dependent on ffmpeg, converting the file to an .mp4 can be easily
accomplished with the following command.

```sh
ffmpeg -f h264 -i bigbuckbunny.264 bigbuckbunny.mp4
```

If you wish to play the H264 file directly, I've had good experience personally with the IINA
video player for macOS. VLC and FFPLAY also work.

## Documentation

You can find auto-generated documentation in the [docs](docs/README.md) folder.

## Contributing

Please contribute features!

Yellowstone covers a very small subset of what's possible
with RTSP/RTP. Feel free to write and submit pull requests for easy to use
abstractions of protocol extensions (such as ONVIFClient), as well as core
features and bug fixes.
