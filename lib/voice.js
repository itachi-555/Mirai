const fs = require("fs");
const { spawn } = require("child_process");
const { getDeviceList } = require("./deviceManager");

const wordToNumber = {
  one: 1,
  two: 2,
  three: 3,
};

function executeOrder(command) {
  const args = command.split(" ");
  if (args.length < 3) return;
  const root = args[0];
  if (root !== "mirai") return;

  const targetDevice = args[1];
  const deviceList = getDeviceList(targetDevice);
  if (!deviceList) return;

  const index = wordToNumber[args[2]];
  let deviceSocket;
  let paramsIndex = 3;

  if (index) {
    deviceSocket = deviceList[index - 1];
  } else {
    deviceSocket = deviceList[0];
    paramsIndex = 2;
  }

  let params = {};
  for (let i = 0; i < args.length - paramsIndex; i++) {
    params[`param${i}`] = args[paramsIndex + i];
  }

  if (deviceSocket && deviceSocket.readyState === 1) {
    deviceSocket.send(JSON.stringify(params));
  }
}

function runVoicePy(voskFile, wavFile, rawFile) {
  console.log(`[VOICE] Running ${voskFile} on ${wavFile}`);
  const pyVosk = spawn("python3", [voskFile, wavFile]);

  pyVosk.stdout.on("data", (data) => {
    const command = data.toString().trim();
    console.log(`[voice.py] ${command}`);
    executeOrder(command);
  });

  pyVosk.stderr.on("data", (data) => {
    const msg = data.toString().trim();
    // Filter out logs starting with "LOG (VoskAPI:" if you want
    if (!msg.startsWith("LOG (VoskAPI:")) {
      console.error(`[voice.py ERROR] ${msg}`);
    }
  });

  pyVosk.on("close", () => {
    console.log(`[voice.py] exited`);
    if (fs.existsSync(wavFile)) fs.unlinkSync(wavFile);
    if (fs.existsSync(rawFile)) fs.unlinkSync(rawFile);
  });
}

module.exports = { runVoicePy };
