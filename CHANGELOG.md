v2.1.1

New features:

**Breaking changes**:

- Parsed RTCP header decapritated the `payload` value to remove potentially confusing functionality
, replacing it with `buffer`. For now, `payload` will still work, but will log a message to switch
to the new key.

New features:

- A parsed version of the RTSP transport header is now in the returned object from connect().
- (TODO) Test suite.
- Changed RTSP link in example, our old link died.

v2.1.0

**Breaking changes**:

- Emitted event `data` now has `channel` as first parameter (making parameters channel, data, packet).

New features:

- Basic parsing for RTCP, splits into the `data` and `controlData` emitted events. (both have same
parameters, see above).
- Improvements to RTP header parsing.

Huge thanks to @RogerHardiman for the contributions!

v2.0.0

The `it works again!` update: 

- A large refactor, so I decided to bump up the major version.
- Fix embarassing errors with copy-pasted JS code from 1.5 years ago.
- Add proper RTSP data framing, other than whatever was there.
- Remove Babel/Gulp entirely, we only use what Node v6.0+ supports as far as ES6.
- Add yarn.lock for anyone using Yarn.
- Fix example.