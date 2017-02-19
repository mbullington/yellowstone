// Yellowstone Example.
// Connect to the RTSP server
// Once connected, open a file, write the SPS and PPS and then start streaming

var RtspClient = require('../lib').RtspClient;
var transform = require('sdp-transform');
var fs = require('fs');
var output_fd;
var output_stream;

var client = new RtspClient();
const filename = 'video.264';
const url = 'rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4';
const header = new Buffer.from([0x00,0x00,0x00,0x01]);
var   rtpPackets = [];


// details is a plain Object that includes...
//   format - string
//   mediaSource - media portion of the SDP
//   transport RTP and RTCP channels

client.connect(url).then(function(details) {
  console.log('Connected. Video format is', details['format']);

  // Open the output file
  output_stream = fs.createWriteStream(filename);
  processConnectionDetails(details);
  client.play();

  // Start a Timer to send OPTIONS every 20 seconds to keep stream alive
  setInterval(function() {
    client.request("OPTIONS");
    },20*1000);
});

// data == packet.payload, just a small convenient thing
// data is for RTP packets
client.on('data', function(channel, data, packet) {
  console.log('RTP Packet', 'ID=' + packet.id, 'TS=' + packet.timestamp, 'M=' + packet.marker);
  processRTPPacket(packet);
});

// control data is for RTCP packets
client.on('controlData', function(channel, rtcpPacket) {
  console.log('RTCP Control Packet', 'TS=' + rtcpPacket.timestamp, 'PT=' + rtcpPacket.packetType);
});

// allows you to optionally allow for RTSP logging
// also allows for you to hook this into your own logging system easily
client.on('log', function(data, prefix) {
  console.log(prefix + ': ' + data);
});


function processConnectionDetails(details) {
  const fmtpConfig = transform.parseFmtpConfig(details['mediaSource'].fmtp[0].config);
  const splitSpropParameterSets = fmtpConfig['sprop-parameter-sets'].split(',');
  const sps_base64 = splitSpropParameterSets[0];
  const pps_base64 = splitSpropParameterSets[1];
  const sps = new Buffer(sps_base64,'base64');
  const pps = new Buffer(pps_base64,'base64');
  output_stream.write(header);
  output_stream.write(sps);
  output_stream.write(header);
  output_stream.write(pps);
};

function processRTPPacket(packet) {
  // accumatate packets with the Marker set to 0
  // when Marker is set to 1 pass the group of packets to processRTPFrame()
  rtpPackets.push(packet.payload);
  if (packet.marker == 1) {
    processRTPFrame(rtpPackets);
    rtpPackets = [];
  }
}

var temp_buffer = [];
function processRTPFrame(rtpPackets) {
  let nals = [];

  for (let i = 0; i < rtpPackets.length; i++) {
    const packet = rtpPackets[i];
    const nal_header_f_bit = (packet[0] >> 7) & 0x01;
    const nal_header_nri = (packet[0] >> 5) & 0x03;
    const nal_header_type = (packet[0] >> 0) & 0x1F;

    if (nal_header_type >= 1 && nal_header_type <= 23) { // Normal NAL. Not fragmented
      nals.push(packet);
    } else if (nal_header_type == 24) { // Aggregation type STAP-A. Multiple NAls in one RTP Packet
      let ptr = 1; // start after the nal_header_type which was '24'
      // if we have at least 2 more bytes (the 16 bit size) then consume more data
      while (ptr + 2 < (packet.length - 1))
      {
          let size = (packet[ptr] << 8) + (packet[ptr + 1] << 0);
          ptr = ptr + 2;
          nals.push(packet.slice(ptr,ptr+size));
          ptr = ptr + size;
      }
    } else if (nal_header_type == 25) { // STAP-B
      // Not supported
    } else if (nal_header_type == 26) { // MTAP-16
      // Not supported
    } else if (nal_header_type == 27) { // MTAP-24
      // Not supported
    } else if (nal_header_type == 28) { // Frag FU-A
      // NAL is split over several RTP packets
      // Accumulate them in a tempoary buffer
      // Parse Fragmentation Unit Header
      const fu_header_s = (packet[1] >> 7) & 0x01;  // start marker
      const fu_header_e = (packet[1] >> 6) & 0x01;  // end marker
      const fu_header_r = (packet[1] >> 5) & 0x01;  // reserved. should be 0
      const fu_header_type = (packet[1] >> 0) & 0x1F; // Original NAL unit header

      // Check Start and End flags
      if (fu_header_s == 1 && fu_header_e == 0) { // Start of Fragment}
        const reconstructed_nal_type = (nal_header_f_bit << 7)
                                      + (nal_header_nri << 5)
                                      + fu_header_type;
        temp_buffer = [];
        temp_buffer.push(reconstructed_nal_type);

        // copy the rest of the RTP payload to the temp buffer
        for (let x=2; x< packet.length;x++) temp_buffer.push(packet[x]);
      }

      if (fu_header_s == 0 && fu_header_e == 0) { // Middle part of fragment}
        for (let x=2; x< packet.length;x++) temp_buffer.push(packet[x]);
      }

      if (fu_header_s == 0 && fu_header_e == 1) { // End of fragment}
        for (let x=2; x< packet.length;x++) temp_buffer.push(packet[x]);
        nals.push(Buffer.from(temp_buffer));
      }
    } else if (nal_header_type == 29) { // Frag FU-B
      // Not supported
    }
  }

  // Write out all the NALs
  for (let x = 0; x < nals.length; x++) {
    output_stream.write(header);
    output_stream.write(nals[x]);
  }

}