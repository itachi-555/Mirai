const { spawn } = require("child_process");

function startVad(vadFile, onData, onError, onClose) {
  console.log("Starting Python VAD process...");
  const pyVad = spawn("python3", [vadFile]);

  pyVad.stdout.on("data", onData);
  pyVad.stderr.on("data", onError);
  pyVad.on("close", onClose);

  return pyVad;
}

module.exports = { startVad };
