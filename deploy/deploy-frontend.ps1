$ErrorActionPreference = 'Stop'

Write-Host 'Installing dependencies'
npm ci

Write-Host 'Building frontend'
npm run build

Write-Host 'Build completed in dist folder'
