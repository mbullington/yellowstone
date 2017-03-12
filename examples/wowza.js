// Yellowstone Example.
// Connect to the RTSP server
// Once connected, open a file, write the SPS and PPS and then start streaming

const { RtspClient, H264Transport } = require('../lib');
const fs = require('fs');

const url = 'rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4';
const filename = 'video.264';

const client = new RtspClient();

// details is a plain Object that includes...
//   format - string
//   mediaSource - media portion of the SDP
//   transport RTP and RTCP channels

client.connect(url, { keepAlive: true }).then((details) => {
  console.log('Connected. Video format is', details.format);

  // Open the output file
  if (details.isH264) {
    const h264 = new H264Transport(client, fs.createWriteStream("bigbuckbunny.264"), details);
  }

  client.play();
});

// data == packet.payload, just a small convenient thing
// data is for RTP packets
client.on('data', function(channel, data, packet) {
  console.log('RTP Packet', 'ID=' + packet.id, 'TS=' + packet.timestamp, 'M=' + packet.marker);
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

