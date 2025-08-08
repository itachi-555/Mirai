import asyncio
import websockets
import pyaudio

SAMPLE_RATE = 16000
FRAME_DURATION_MS = 30
FRAME_SIZE = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000)  # 480 samples
BYTES_PER_SAMPLE = 2
CHUNK = FRAME_SIZE * BYTES_PER_SAMPLE  # bytes per frame

WS_URI = "ws://192.168.0.162:3000?device=input"  # replace with your server IP

async def send_audio():
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=SAMPLE_RATE,
                    input=True,
                    frames_per_buffer=FRAME_SIZE)

    print("Mic streaming started...")

    async with websockets.connect(WS_URI) as ws:
        try:
            while True:
                data = stream.read(FRAME_SIZE, exception_on_overflow=False)
                await ws.send(data)
        except Exception as e:
            print(f"WebSocket connection closed: {e}")
        finally:
            stream.stop_stream()
            stream.close()
            p.terminate()

if __name__ == "__main__":
    asyncio.run(send_audio())
