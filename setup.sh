#!/bin/bash

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Detect shell and activate venv accordingly
SHELL_NAME=$(basename "$SHELL")

case "$SHELL_NAME" in
  bash|zsh)
    # For bash or zsh
    source venv/bin/activate
    ;;
  fish)
    # For fish shell
    source venv/bin/activate.fish
    ;;
  *)
    echo "Unsupported shell: $SHELL_NAME. Please activate venv manually."
    ;;
esac

# Now install Python dependencies
pip install --upgrade pip
pip install webrtcvad vosk

# Install npm packages and run server.js
npm install
node server.js
