var RtspClient = require('../lib').RtspClient;

var client = new RtspClient();

// details is a plain Object that includes...
// format - string
client.connect('rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4').then(function(details) {
  client.play();
}).catch(function(err) {
  // console.log(err.stack);
});

// data == packet.payload, just a small convenient thing
// data is for RTP packets
client.on('data', function(channel, data, packet) {
  console.log('RTP Packet', 'ID=' + packet.id, 'TS=' + packet.timestamp, 'M=' + packet.marker);
});

// control data is for RTCP packets
client.on('controlData', function(channel, rtcpPacket) {
  console.log('RTP Control Packet', 'TS=' + rtcpPacket.timestamp, 'PT=' + rtcpPacket.packetType);
});

// allows you to optionally allow for RTSP logging
// also allows for you to hook this into your own logging system easily
client.on('log', function(data, prefix) {
  console.log(prefix + ': ' + data);
});
