$ErrorActionPreference = 'Stop'

Write-Host 'Installing dependencies'
npm ci

Write-Host 'Building backend'
npm run build

Write-Host 'Starting backend in production mode'
$env:NODE_ENV = 'production'
node dist/server.js
