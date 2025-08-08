# Mirai: A Smart Room Project

Welcome to **Mirai**, a futuristic smart room project that lets you control your environment using your voice. With real-time audio streaming and socket-based communication, Mirai brings a sleek, modular automation system to life.

> "Speak it, and it shall happen."


## 🚀 Features

* 🎙️ Voice-Controlled System (Vosk + WebRTC VAD)
* 🧠 Modular Client/Device Architecture
* 🛜 Real-time Socket Communication
* 🔌 Multi-Device Support (Lights, TV, Windows, Doors, and more)
* 🌐 Web Interface for Manual Control + Blog/Fandom Pages


## 🗂️ Project Structure

```
mirai/
├── server.js              # Main server entry
├── lib/                   # Server-side helper modules
├── py/                    # Python voice/audio processing scripts
├── config.json            # Configuration file (edit model paths, server params, etc.)
├── public/                # Browser interface (manual control UI + personal blog)
├── clients/               
│   ├── controllers/       # Audio streaming clients (Linux, Windows, Android)
│   └── devices/           # Controlled devices (Arduino, apps for TVs, PCs, etc.)
├── setup.sh               # Setup script to configure environment
└── README.md              # This file
```


## 📦 Command Structure

Each voice command follows a strict pattern:

```
root ("mirai")
  └── target_device (e.g., "lights", "door")
        └── index ("one", "two", "three")
              └── event object (param0: ..., param1: ...)
```

**Example:**

```
"mirai lights on two"
```

This turns on the second light.


## ⚙️ Setup Instructions

### ✅ Automatic Setup (recommended)

Run:

```bash
chmod +x setup.sh
./setup.sh
```

This script will:

* Create a Python virtual environment
* Detect your shell and activate accordingly (bash, zsh, fish, etc.)
* Install required Python modules (`vosk`, `webrtcvad`)
* Install Node.js packages via `npm install`
* Prepare the project structure

### 🛠️ Manual Setup (if something goes wrong)

1. **Install dependencies:**

   * Python 3.8+
   * Node.js + npm
   * `ffmpeg` (required for audio processing)

2. **Setup Python environment:**

```bash
python3 -m venv venv
# Activate depending on your shell:
# Bash/Zsh:
source venv/bin/activate
# Fish:
source venv/bin/activate.fish
# Csh:
source venv/bin/activate.csh
pip install vosk webrtcvad
```

3. **Install Node.js dependencies:**

```bash
npm install
```

4. **Edit `config.json`:**
   Make sure the Vosk model path is set properly:

```json
{
  "VOSK_MODEL_PATH": "./models/vosk-model-small-en-us-0.15",
  "PORT": 3000
}
```

5. **Start the server:**

```bash
node server.js
```


## 📲 Controller Apps

Download the official Mirai controller clients for your platform:

| Platform | Download Link   |
| -------- | --------------- |
| Linux    | [Coming Soon]() |
| Windows  | [Coming Soon]() |
| Android  | [Coming Soon]() |

> These clients stream your microphone audio to the server in real time.


## 💡 Controlled Devices

These will be stored under `clients/devices/` and include:

* Arduino-based lights
* OS-level PC controls
* Smart TV interfaces
* Windows automation

(More coming soon)


## 🌐 Web UI & Blog

Available under `/public`:

* 🎛️ Manual input control UI (buttons, sliders, toggles)
* 📝 A personal blog/fandom page (about the room, hobbies, and more)


## 📌 Notes

* Ensure `ffmpeg` is installed and available in your system path.
* If Vosk gives model loading errors, make sure the path is correct and the model is extracted properly.
* You can change the server port and other params in `config.json`


## 🧠 About the Project

Mirai was built as a passion project to bring voice-controlled environments to life. Combining tech, art, and a bit of sci-fi flair, it's designed to reflect a personal vision of the future.


## 📬 Feedback & Contributions

Want to contribute or suggest features? Open a pull request or issue on GitHub.


**Made with 💡 by Younes**
