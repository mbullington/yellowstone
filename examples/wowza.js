var RtspClient = require('../lib').RtspClient;
var transform = require('sdp-transform');

var client = new RtspClient();

// details is a plain Object that includes...
//   format - string
//   mediaSource - media portion of the SDP
//   transport RTP and RTCP channels

client.connect('rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4').then(function(details) {
  console.log('Connected. Video format is', details['format']);
  try {
    var fmtpConfig = transform.parseFmtpConfig(details['mediaSource'].fmtp[0].config);
    var splitSpropParameterSets = fmtpConfig['sprop-parameter-sets'].split(',');
    var sps_base64 = splitSpropParameterSets[0];
    var pps_base64 = splitSpropParameterSets[1];
    console.log('SPS(base64) is',sps_base64,'PPS(base64) is',pps_base64);
  } catch (err) {}
  console.log('RTP and RTCP Transport channels are', details['transport']);
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
