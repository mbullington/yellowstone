yellowstone v3.0.4
===

[![NPM](https://img.shields.io/npm/v/yellowstone.svg)](https://www.npmjs.com/package/yellowstone)

The RTP/RTSP client for Node.js.

```
npm install yellowstone --save
```

## Getting Started

Yellowstone is a library to receive video, andio and metadata from RTSP/RTP sources including Wowza and IP Cameras. The library can parse some common video and audio transport formats and delivers the (often compressed) video and audio data to the library user, or writes it to a file. The library doe not include codec decoders.

Yellowstone was co-developed by Michael Bullington and Roger Hardiman.

## Current Features

- Receive Raw RTP/AVP via UDP & TCP (interleaved)
  * Basic and Digest Authentication
  * Pause, Play, and Teardown (Close)
- H264/AAC transport parsing (and writing video to a .264 file)
- H265/HEVC transport parsing (and writing video to a .265 file)
- AAC transport paring (and writing audio to an .aac file)
- ONVIF Metadata parsing (and writing to an output file)
- ONVIF extensions to RTSP
- ONVIF Audio Backchannel, sending ALaw audio to an IP Camera
- Simple RTCP parsing

## Examples

An example of most API features can be found at [examples/demo.js](examples/demo.js), which will
connect to a RTSP Stream and dump H264, H265 and AAC contents to a file.
For example
```node examples\demo.js rtsp://myhostname/stream1```
```node examples\demo.js -u username -p password rtsp://myhostname/stream1```

To testthe output file with a video player you can use FFMPEG's ffplay command
```ffplay outfile.264```

While yellowstone is /**not**/ dependent on ffmpeg, converting the file to an .mp4 can be easily
accomplished with the following command.

```sh
ffmpeg -f h264 -i outfile.264 -vcodec copy outfile.mp4
```


The audio backchannel example from vietelle-solutions can connect to an ONVIF camera and send a .alaw audio file to the camera
It plays a clip from the Monty Python's Holy Grail.
An alaw file can be played with
```ffplay -f alaw -ar 8k -ac 1 audio.alaw```


If you wish to play the H264 file directly, I've had good experience personally with the IINA
video player for macOS. VLC and FFPLAY also work.

## Documentation

You can find auto-generated documentation in the [docs](docs/README.md) folder.
Documentation can be re-generated with
```npm run typedoc```

## Building from source
Compile the Typescript source code to Javascrip (in the dist folder) using these commands:-
```npm install
   npm run build
```

## Contributing

Please contribute features!

Yellowstone covers a very small subset of what's possible with RTSP/RTP. Feel free to write and submit pull requests for new features and bug fixes.
