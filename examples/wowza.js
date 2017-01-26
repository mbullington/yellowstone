var RtspClient = require('../lib').RtspClient;

var client = new RtspClient();

// details is a plain Object that includes...
// format - string
client.connect('rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov').then(function(details) {
  client.play();
}).catch(function(err) {
  // console.log(err.stack);
});

// data == packet.payload, just a small convenient thing
client.on('data', function(channel, data, rtp_packet) {
  console.log('RTP Packet', 'ID=' + rtp_packet.id, 'TS=' + rtp_packet.timestamp, 'M=' + rtp_packet.marker);
});

client.on('controlData', function(channel, rtcp_packet) {
  console.log('RTP Control Packet', 'TS=' + rtcp_packet.timestamp, 'PT=' + rtcp_packet.packetType);
});

// allows you to optionally allow for RTSP logging
// also allows for you to hook this into your own logging system easily
client.on('log', function(data, prefix) {
  console.log(prefix + ': ' + data);
});
