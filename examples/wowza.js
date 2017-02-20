// Yellowstone Example.
// Connect to the RTSP server
// Once connected, open a file, write the SPS and PPS and then start streaming

var RtspClient = require('../lib').RtspClient;
var H264Transport = require('../lib/H264Transport').H264Transport;

const url = 'rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4';
const filename = 'video.264';

var client = new RtspClient();
var h264File;
var clientSsrc = getRandomIntInclusive(1,0xffffffff);


// details is a plain Object that includes...
//   format - string
//   mediaSource - media portion of the SDP
//   transport RTP and RTCP channels

client.connect(url).then(function(details) {
  console.log('Connected. Video format is', details['format']);

  // Open the output file
  if (details['format'] == 'H264') {
    h264File = new H264Transport(filename);
    h264File.processConnectionDetails(details);
  }
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
  if (h264File) h264File.processRTPPacket(packet);
});

// control data is for RTCP packets
client.on('controlData', function(channel, rtcpPacket) {
  console.log('RTCP Control Packet', 'TS=' + rtcpPacket.timestamp, 'PT=' + rtcpPacket.packetType);
  let rtcpReceiverReport = new Buffer(8);
  const version = 2;
  const padding_bit = 0;
  const report_count = 0; // an empty packet
  const packet_type = 201; // rtcpReceiverReport
  const length = 1; // num 32 bit words minus 1
  rtcpReceiverReport[0] = (version << 6) + (padding_bit << 5) + report_count;
  rtcpReceiverReport[1] = packet_type;
  rtcpReceiverReport[2] = (length >> 8) & 0xFF;
  rtcpReceiverReport[3] = (length >> 0) & 0XFF;
  rtcpReceiverReport[4] = (clientSsrc >> 24) & 0xFF;
  rtcpReceiverReport[5] = (clientSsrc >> 16) & 0xFF;
  rtcpReceiverReport[6] = (clientSsrc >> 8) & 0xFF;
  rtcpReceiverReport[7] = (clientSsrc >> 0) & 0xFF;
  client.sendInterleavedData(channel,rtcpReceiverReport);
  
});

// allows you to optionally allow for RTSP logging
// also allows for you to hook this into your own logging system easily
client.on('log', function(data, prefix) {
  console.log(prefix + ': ' + data);
});


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
