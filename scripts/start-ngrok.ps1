# Jalankan tunnel ngrok untuk TA-LAP (frontend port 3000)
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$config = Join-Path $root "scripts\ngrok.yml"

$ngrokCmd = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokCmd) {
  Write-Host "ERROR: ngrok belum terinstall." -ForegroundColor Red
  Write-Host "Install: winget install Ngrok.Ngrok"
  exit 1
}

Write-Host "Memulai ngrok tunnel (port 3000)..." -ForegroundColor Cyan
Write-Host "Dashboard ngrok: http://127.0.0.1:4040"
Write-Host ""
Write-Host "Jika belum pernah setup, daftar gratis di https://ngrok.com lalu jalankan:" -ForegroundColor Yellow
Write-Host "  ngrok config add-authtoken YOUR_TOKEN"
Write-Host ""
Write-Host "Setelah ngrok jalan, buka terminal baru dan jalankan:" -ForegroundColor Yellow
Write-Host "  powershell -ExecutionPolicy Bypass -File scripts\sync-ngrok-env.ps1"
Write-Host ""

& ngrok start talap-fe --config $config
