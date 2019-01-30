# v3.0.1

**Bug fixes**:

- Fixed Digest authentication thanks to @oleaasbo

# v3.0.0

Huge shoutout to @RogerHardiman for co-developing this release of the library!

**Breaking changes**:

- Expected Node.js version increased to Node.js LTS (`8.11.3`).
  * This code may still work on older Node.js versions, but they're not officially supported.
  * If this does not work for you, rebuilding using a lower target in `tsconfig.json` should help.
- Removed `RTCPPacket.payload` that was deprecated in `v2.1.1`
- Renamed `RtspClient` to `RTSPClient`
- Renamed `OnvifRtspClient` to `ONVIFClient`
- Changed structure of `RTSPClient#request`, instead of returning a `Promise` with headers, it now returns a `Promise` of an object with a property `headers`.

New features:

- H264 transport!
- UDP support!
- Move to TypeScript & new ES2017 features
  * **Why?** TypeScript should help improve code quality (something I've noticed in my old code the past few months through GitHub issues & pull requests). Type errors, general confusion about code, etc.
  * Async/await control flow helps to simplify codebase and make it more readable.
  * Hopefully, this will not alieniate potential contributors.

# v2.1.1

**Breaking changes**:

- Parsed RTCP header deprecated the `payload` value to remove potentially confusing functionality
, replacing it with `buffer`. For now, `payload` will still work, but will log a message to switch
to the new key.

New features:

- A parsed version of the RTSP transport header is now in the returned object from connect().
- (TODO) Test suite.
- Changed RTSP link in example, our old link died.

# v2.1.0

**Breaking changes**:

- Emitted event `data` now has `channel` as first parameter (making parameters channel, data, packet).

New features:

- Basic parsing for RTCP, splits into the `data` and `controlData` emitted events. (both have same
parameters, see above).
- Improvements to RTP header parsing.

Huge thanks to @RogerHardiman for the contributions!

# v2.0.0

The `it works again!` update: 

- A large refactor, so I decided to bump up the major version.
- Fix embarassing errors with copy-pasted JS code from 1.5 years ago.
- Add proper RTSP data framing, other than whatever was there.
- Remove Babel/Gulp entirely, we only use what Node v6.0+ supports as far as ES6.
- Add yarn.lock for anyone using Yarn.
- Fix example.