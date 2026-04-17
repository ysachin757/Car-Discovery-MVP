#!/usr/bin/env bash
set -euo pipefail

APP_NAME="car-discovery-backend"

echo "Installing dependencies"
npm ci

echo "Building application"
npm run build

echo "Starting production server"
NODE_ENV=production node dist/server.js
