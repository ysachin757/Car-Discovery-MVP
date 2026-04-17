#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies"
npm ci

echo "Building frontend"
npm run build

echo "Build complete in dist/"
