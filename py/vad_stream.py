import sys
import collections
import webrtcvad
import json

# Load config from JSON file
with open('config.json') as f:
    config = json.load(f)

SAMPLE_RATE = config["SAMPLE_RATE"]
FRAME_DURATION_MS = config["FRAME_DURATION_MS"]
BYTES_PER_SAMPLE = config["BYTES_PER_SAMPLE"]
RING_BUFFER_SIZE = config["RING_BUFFER_SIZE"]
VAD_MODE = config["VAD_MODE"]
SPEECH_START_THRESHOLD = config["SPEECH_START_THRESHOLD"]
SPEECH_END_THRESHOLD = config["SPEECH_END_THRESHOLD"]

FRAME_SIZE = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000) * BYTES_PER_SAMPLE

vad = webrtcvad.Vad(VAD_MODE)
ring_buffer = collections.deque(maxlen=RING_BUFFER_SIZE)
talking = False

def read_frame():
    return sys.stdin.buffer.read(FRAME_SIZE)

while True:
    frame = read_frame()
    if len(frame) < FRAME_SIZE:
        break

    is_speech = vad.is_speech(frame, SAMPLE_RATE)
    ring_buffer.append(is_speech)
    speech_ratio = sum(ring_buffer) / len(ring_buffer)

    if not talking and speech_ratio > SPEECH_START_THRESHOLD:
        talking = True
        print('{"event": "speech_start"}', flush=True)
    elif talking and speech_ratio < SPEECH_END_THRESHOLD:
        talking = False
        print('{"event": "speech_end"}', flush=True)
