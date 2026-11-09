#!/bin/bash
set -e

# Assign parameters with fallback defaults
APP_NAME="${1}"

# Load NVM environment if installed
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use --silent || true

# Check if PM2 is managing the app and restart or start it
if pm2 id "$APP_NAME" | grep -q '[0-9]'; then
    echo "App '$APP_NAME' is running. Triggering rolling reload/restart..."
    pm2 restart "$APP_NAME"
else
    echo "App '$APP_NAME' is completely stopped. Initializing process profile..."
    pm2 start index.js --name "$APP_NAME"
fi