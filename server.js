const fs = require("fs");
const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const { getLocalIPAddress } = require("./lib/ip");
const { startVad } = require("./lib/vad");
const { runVoicePy } = require("./lib/voice");
const { handleWebSocket } = require("./lib/wsHandler");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const HOST = config.HOST || getLocalIPAddress();
const PORT = config.PORT || 3000;

const app = express();
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(PORT, HOST, () => {
  console.log(`HTTP server running at http://${HOST}:${PORT}`);
});

const pyVad = startVad(
  config.VAD_STREAM_FILE,
  () => {}, // stdout is handled inside wsHandler
  (data) => console.error("[VAD ERROR]", data.toString()),
  (code) => console.log(`[VAD] exited with code ${code}`)
);

handleWebSocket(wss, config, pyVad, runVoicePy);
