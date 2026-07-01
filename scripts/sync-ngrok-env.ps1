# Sinkronkan URL ngrok ke file .env (jalankan setelah ngrok aktif)
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$beEnv = Join-Path $root "ta-lap-be\.env"
$feEnv = Join-Path $root "ta-lap-fe\.env.local"

Write-Host "Mengambil URL ngrok dari http://127.0.0.1:4040 ..."

try {
  $resp = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 5
} catch {
  Write-Host "ERROR: ngrok belum jalan. Jalankan dulu: scripts\start-ngrok.ps1" -ForegroundColor Red
  exit 1
}

$tunnel = $resp.tunnels | Where-Object { $_.public_url -like "https://*" } | Select-Object -First 1

if (-not $tunnel) {
  Write-Host "ERROR: Tunnel HTTPS tidak ditemukan." -ForegroundColor Red
  exit 1
}

$publicUrl = $tunnel.public_url.TrimEnd("/")
Write-Host "URL ngrok: $publicUrl" -ForegroundColor Cyan

function Set-EnvLine {
  param(
    [string]$FilePath,
    [string]$Key,
    [string]$Value
  )

  if (-not (Test-Path $FilePath)) {
    New-Item -ItemType File -Path $FilePath -Force | Out-Null
  }

  $lines = @(Get-Content $FilePath -ErrorAction SilentlyContinue)
  $updated = $false
  $newLines = @()

  foreach ($line in $lines) {
    if ($line -match "^$([regex]::Escape($Key))=") {
      $newLines += "$Key=$Value"
      $updated = $true
    } else {
      $newLines += $line
    }
  }

  if (-not $updated) {
    $newLines += "$Key=$Value"
  }

  Set-Content -Path $FilePath -Value $newLines
}

Set-EnvLine -FilePath $beEnv -Key "FRONTEND_URL" -Value $publicUrl
Set-EnvLine -FilePath $feEnv -Key "NEXT_PUBLIC_API_URL" -Value "/api"
Set-EnvLine -FilePath $feEnv -Key "NEXT_PUBLIC_APP_URL" -Value $publicUrl

Write-Host ""
Write-Host "Sudah diupdate:" -ForegroundColor Green
Write-Host "  ta-lap-be/.env  -> FRONTEND_URL=$publicUrl"
Write-Host "  ta-lap-fe/.env.local -> NEXT_PUBLIC_API_URL=/api"
Write-Host ""
Write-Host "Langkah berikutnya:" -ForegroundColor Yellow
Write-Host "  1. Restart backend (ta-lap-be): Ctrl+C lalu npm run dev"
Write-Host "  2. Restart frontend (ta-lap-fe): Ctrl+C lalu npm run dev:ngrok"
Write-Host "  3. Buka di HP: $publicUrl"
Write-Host ""
Write-Host "Google OAuth -> tambahkan Authorized JavaScript origins:" -ForegroundColor Yellow
Write-Host "  $publicUrl"
