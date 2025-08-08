import asyncio
import websockets
import pyaudio
import time
import json
import os
import urllib.request
import sys
import signal

# --- CONFIG SETUP ---

CONFIG_URL = "https://raw.githubusercontent.com/itachi-555/Mirai/main/clients/controllers/config.json"
BASE_DIR = os.path.dirname(os.path.abspath(sys.argv[0]))
CONFIG_PATH = os.path.join(BASE_DIR, "config.json")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print("Downloading config.json from GitHub...")
        urllib.request.urlretrieve(CONFIG_URL, CONFIG_PATH)
        print("✅ config.json downloaded.")
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

config = load_config()

# --- AUDIO CONSTANTS ---
SAMPLE_RATE = config.get("SAMPLE_RATE", 16000)
FRAME_DURATION_MS = config.get("FRAME_DURATION_MS", 30)
FRAME_SIZE = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000)
BYTES_PER_SAMPLE = 2
CHUNK = FRAME_SIZE * BYTES_PER_SAMPLE

WS_URI = config.get("WS_URI", "ws://localhost:3000?device=input")

# --- CLEAN EXIT SUPPORT ---
should_exit = False

def handle_exit(signum, frame):
    global should_exit
    should_exit = True
    print("\n🛑 Exiting...")

signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

# --- MAIN AUDIO LOGIC ---
async def send_audio():
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=SAMPLE_RATE,
                    input=True,
                    frames_per_buffer=FRAME_SIZE)

    print("🎤 Mic streaming started...")

    try:
        while not should_exit:
            try:
                async with websockets.connect(WS_URI) as ws:
                    while not should_exit:
                        data = stream.read(FRAME_SIZE, exception_on_overflow=False)
                        await ws.send(data)
            except (ConnectionRefusedError, OSError):
                print("⚠️  Server is not running or unreachable. Retrying in 3 seconds...")
                await asyncio.sleep(3)
            except websockets.exceptions.ConnectionClosedError:
                print("⚠️  Connection closed unexpectedly. Retrying in 3 seconds...")
                await asyncio.sleep(3)
            except Exception as e:
                print(f"⚠️  Unexpected error: {e}")
                await asyncio.sleep(3)
    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()

if __name__ == "__main__":
    asyncio.run(send_audio())
