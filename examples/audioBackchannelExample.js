// Yellowstone Example.
//
// Connects to the specified RTSP server url with ONVIF Audio Bachchannel required.
// Once connected it sends 'audio.alaw' to the ONVIF Camera
//
// Yellowstone is written in TypeScript. This example uses Javascript and
// the typescript compiled files in the ./dist folder
//
const { RTSPClient, H264Transport, AACTransport } = require("../dist");
const fs = require("fs");
const { exit } = require("process");

// User-specified details here.
const url = "rtsp://10.61.185.18/Streaming/Channels/101/?transportmode=unicast&profile=Profile_1";
const username = "admin";
const password = "Admin123";

// Add the ONVIF Audio Backchannel Header
const header = { "Require": "www.onvif.org/ver20/backchannel" };

// Step 1: Create an RTSPClient instance
const client = new RTSPClient(username, password, header);

// Step 2: Connect to a specified URL using the client instance.
//
// "keepAlive" option is set to true by default
// "connection" option is set to "udp" by default. Use "tcp" for interleaved mode
client.connect(url, { connection: "tcp" })
  .then(async (detailsArray) => {
    console.log("Connected");

    // Step 5: Start streaming!
    await client.play();

    // Step 6: Send audio backchannel
    // Edit audio encoding config of camera to ALAW because test file is alaw file 
    // this run when: camera is supported ONVIF backchannel
    fs.readFile("./examples/audio.alaw", async (error, data) => {
      if (error) {
        console.log("ERROR - unable to open audio file")
        exit();
      }
      await client.sendAudioBackChannel(data); // block until audio has been sent
      client.close();
    });
  })
  .catch(e => console.log(e));

// The "data" event is fired for every RTP packet.
client.on("data", (channel, data, packet) => {
  // console.log("RTP:", "Channel=" + channel, "TYPE=" + packet.payloadType, "ID=" + packet.id, "TS=" + packet.timestamp, "M=" + packet.marker);
});

// The "controlData" event is fired for every RTCP packet.
client.on("controlData", (channel, rtcpPacket) => {
  // console.log("RTCP:", "Channel=" + channel, "TS=" + rtcpPacket.timestamp, "PT=" + rtcpPacket.packetType);
});

// The "log" event allows you to optionally log any output from the library.
// You can hook this into your own logging system super easily.

client.on("log", (data, prefix) => {
  console.log(prefix + ": " + data);
});

