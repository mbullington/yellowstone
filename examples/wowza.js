// Yellowstone Example.
//
// Connects to the specified RTSP server url,
// Once connected, opens a file and streams H264 and AAC to the files
//
// Yellowstone is written in TypeScript. This example uses Javascript and
// the typescript compiled files in the ./dist folder

const { RTSPClient, H264Transport, H265Transport, AACTransport } = require("../dist");
const fs = require("fs");
const { exit } = require("process");

// User-specified details here.
//const url = "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4"
//const url = "rtsp://zephyr.rtsp.stream/movie?streamKey=ddeb34302a9148df691e0c6b1cac9cfc"
const url = "rtsp://zephyr.rtsp.stream/pattern?streamKey=38c2051ddb4b2a72d02a7db4fe89418c"


const filename = "output";
const username = "";
const password = "";
const durationSeconds = 5; // duration of streaming (0 = always stream)

// Step 1: Create an RTSPClient instance
const client = new RTSPClient(username, password);

// Step 2: Connect to a specified URL using the client instance.
//
// "keepAlive" option is set to true by default
// "connection" option is set to "udp" by default. 
client.connect(url, { connection: "tcp" })
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

    // Optional - Terminate the RTSP connection after N Seconds
    if (durationSeconds > 0) {
      setTimeout(closeFunc, durationSeconds * 1000, "closing connection after " + durationSeconds + " seconds");
    }
    
    
  })
  .catch(e => console.log(e));

// Optional demo. Close the RTSP connection after 5 seconds
async function closeFunc(msg ) {
  console.log(`closing connection: ${msg}`);
  client.removeAllListeners("data");
  client.removeAllListeners("controlData");
  await client.close();
}
  
// The "data" event is fired for every RTP packet.
client.on("data", (channel, data, packet) => {
  console.log("RTP:", "Channel=" + channel, "TYPE=" + packet.payloadType, "ID=" + packet.id, "TS=" + packet.timestamp, "M=" + packet.marker);
});

// The "controlData" event is fired for every RTCP packet.
client.on("controlData", (channel, rtcpPacket) => {
  console.log("RTCP:", "Channel=" + channel, "TS=" + rtcpPacket.timestamp, "PT=" + rtcpPacket.packetType);
});

// The "log" event allows you to optionally log any output from the library.
// You can hook this into your own logging system super easily.

client.on("log", (data, prefix) => {
  console.log(prefix + ": " + data);
});

