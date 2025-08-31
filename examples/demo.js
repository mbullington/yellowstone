// Yellowstone Example.
//
// Connects to the specified RTSP server url,
// Once connected, opens a file and streams H264 and AAC to the files
//
// Yellowstone is written in TypeScript. This example uses Javascript and
// the typescript compiled files in the ./dist folder
//
//
// Note on RTSPS (TLS) connection
// Test Bosch IP Camera with "RTSPS" will stream "rtp over rtsp" in a Secure RTSPS connection
// Text Axis IP Camera with "RTSPS" wants to encrypt the RTP packets (SRTP) which this library does not currently support and uses RTP/SAVP instead of RTP/AVP

// Used to connect to Wowza Demo URL but they have taken it away, and the replacement URL on their web site does not work.

const { RTSPClient, H264Transport, H265Transport, AV1Transport, AACTransport } = require("../dist");
const fs = require("fs");
const { exit } = require("process");
const { program } = require("commander");

program.name("demo");
program.description("Yellowstone RTSP Client Test Software");
program.option('-u, --username <value>', 'Optional RTSP Username');
program.option('-p, --password <value>', 'Optional RTSP Password');
program.option('-o, --outfile <value>', 'Optional Output File with no File Extension for captured H264/H265/AV1/AAC');

program.argument('<rtsp url eg rtsp://1.2.3.4/stream1>');

program.parse(process.argv);
const options = program.opts();

// Will automatically exit if the Argument (the RTSL URL) is missing
const url = program.args[0];
let username = "";
let password = "";
if ('username' in options) username = options.username;
if ('password' in options) password = options.password;

const filename = "outfile"

console.log("Connecting to " + url);

// Step 1: Create an RTSPClient instance
const client = new RTSPClient(username, password);

// Step 2: Connect to a specified URL using the client instance.
//
// "keepAlive" option is set to true by default
// "connection" option is set to "udp" by default and defines the method the RTP media packets are set to Yellowstone. Options are "udp" or "tcp" (where RTP media packets are sent down the RTSP connection)
// "secure" option is set to true when connecting with TLS to the RTSP Server (eg for RTSPS)
client.connect(url, { connection: "tcp", secure: false })
  .then(async (detailsArray) => {
    console.log("Connected");

    if (detailsArray.length == 0) {
      console.log("ERROR: There are no compatible RTP payloads to save to disk");
      exit();
    }

    for (let x = 0; x < detailsArray.length; x++) {
      let details = detailsArray[x];
      console.log(`Stream ${x}. Codec is`, details.codec);

      // Step 3: Open the output file
      if (details.codec == "H264") {
        const videoFile = fs.createWriteStream(filename + '.264');
        // Step 4: Create H264Transport passing in the client, file, and details
        // This class subscribes to the client 'data' event, looking for the video payload
        const h264 = new H264Transport(client, videoFile, details);
      }
      if (details.codec == "H265") {
        const videoFile = fs.createWriteStream(filename + '.265');
        // Step 4: Create H265Transport passing in the client, file, and details
        // This class subscribes to the client 'data' event, looking for the video payload
        const h265 = new H265Transport(client, videoFile, details);
      }
      if (details.codec == "AV1") {
        const videoFile = fs.createWriteStream(filename + '.obu');
        // Step 4: Create AV1Transport passing in the client, file, and details
        // This class subscribes to the client 'data' event, looking for the video payload
        const av1 = new AV1Transport(client, videoFile, details);
      }
      if (details.codec == "AAC") {
        const audioFile = fs.createWriteStream(filename + '.aac');
        // Add AAC Transport
        // This class subscribes to the client 'data' event, looking for the audio payload
        const aac = new AACTransport(client, audioFile, details);
      }
    }

    // Step 5: Start streaming!
    await client.play();
    console.log("Play sent");

  })
  .catch(e => {
      console.log(e);
      client.removeAllListeners();
      client.close(true); // true = don't send a TEARDOWN
    }
  );

// The "data" event is fired for every RTP packet.
client.on("data", (channel, data, packet) => {
  console.log("RTP:", "Channel=" + channel, "TYPE=" + packet.payloadType, "ID=" + packet.id, "TS=" + packet.timestamp, "M=" + packet.marker, (packet.wallclockTime == undefined ? "Time=Unknown" : "Time="+packet.wallclockTime.toISOString()));
});

// The "controlData" event is fired for every RTCP packet.
client.on("controlData", (channel, rtcpPacket) => {
  console.log("RTCP:", "Channel=" + channel, "PT=" + rtcpPacket.packetType);
});

// The "log" event allows you to optionally log any output from the library.
// You can hook this into your own logging system super easily.

client.on("log", (data, prefix) => {
  console.log(prefix + ": " + data);
});

