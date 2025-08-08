from vosk import Model, KaldiRecognizer
import wave
import json

# Load config
with open('config.json') as f:
    config = json.load(f)

# Load model and audio
model = Model(config["VOSK_MODEL_PATH"])
wf = wave.open(config["WAV_FILE"], "rb")
main = config["WAKE_WORD"]
commands = config["COMMANDS"]

# Build allowed phrases
allowed_phrases = []
for cmd in commands:
    base = cmd[0]
    if len(cmd) == 2:
        for arg1 in cmd[1]:
            allowed_phrases.append(f"{main} {base} {arg1}")
    elif len(cmd) == 3:
        for arg1 in cmd[1]:
            for arg2 in cmd[2]:
                allowed_phrases.append(f"{main} {base} {arg1} {arg2}")

grammar = json.dumps(allowed_phrases)

# Recognizer setup
recognizer = KaldiRecognizer(model, wf.getframerate(), grammar)

# Process audio
results = []
while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if recognizer.AcceptWaveform(data):
        results.append(json.loads(recognizer.Result()))

results.append(json.loads(recognizer.FinalResult()))

# Print recognized text
for result in results:
    if "text" in result:
        print(result["text"])
