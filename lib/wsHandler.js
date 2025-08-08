const url = require("url");
const fs = require("fs");
const { addDevice, removeDevice } = require("./deviceManager");

function handleWebSocket(wss, config, pyVad, runVoicePy) {
  const {
    VOSK_RECOGNIZER_FILE,
    RAW_FILE,
    WAV_FILE,
    SAMPLE_RATE,
    PRE_SPEECH_SECONDS,
  } = config;

  const BYTES_PER_SAMPLE = 2;
  const BYTES_PER_SECOND = SAMPLE_RATE * BYTES_PER_SAMPLE;

  let preSpeechBuffer = [];
  let preSpeechBufferBytes = 0;
  let speechBuffer = [];
  let isTalking = false;

  function addToPreSpeechBuffer(chunk) {
    preSpeechBuffer.push(chunk);
    preSpeechBufferBytes += chunk.length;
    while (preSpeechBufferBytes > BYTES_PER_SECOND * PRE_SPEECH_SECONDS) {
      const dropped = preSpeechBuffer.shift();
      preSpeechBufferBytes -= dropped.length;
    }
  }

  function saveSpeechToFile(buffer) {
    fs.writeFileSync(RAW_FILE, buffer);
    console.log(`[SAVE] Raw audio saved to ${RAW_FILE}`);

    const ffmpeg = require("child_process").spawn("ffmpeg", [
      "-f", "s16le",
      "-ar", SAMPLE_RATE.toString(),
      "-ac", "1",
      "-i", RAW_FILE,
      WAV_FILE,
    ]);

    ffmpeg.on("close", () => {
      runVoicePy(VOSK_RECOGNIZER_FILE, WAV_FILE, RAW_FILE);
    });
  }

  pyVad.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    for (const line of lines) {
      try {
        const msg = JSON.parse(line);
        if (msg.event === "speech_start" && !isTalking) {
          isTalking = true;
          speechBuffer = [...preSpeechBuffer];
          preSpeechBuffer = [];
          preSpeechBufferBytes = 0;
        } else if (msg.event === "speech_end" && isTalking) {
          isTalking = false;
          if (speechBuffer.length > 0) {
            saveSpeechToFile(Buffer.concat(speechBuffer));
          }
          speechBuffer = [];
        }
      } catch (_) {}
    }
  });

  wss.on("connection", (ws, req) => {
    const { query } = url.parse(req.url, true);
    const device = query.device;
    if (!device) return ws.close();

    addDevice(device, ws);
    console.log(`Client connected, device=${device}`);

    ws.on("message", (data) => {
      if (Buffer.isBuffer(data)) {
        addToPreSpeechBuffer(data);
        if (isTalking) speechBuffer.push(data);
        pyVad.stdin.write(data);
      } else {
        console.warn("Received non-buffer data from client");
      }
    });

    ws.on("close", () => {
      console.log(`Client disconnected, device=${device}`);
      removeDevice(device, ws);
    });

    ws.on("error", (err) => {
      console.error(`WebSocket error: ${err.message}`);
    });
  });
}

module.exports = { handleWebSocket };
