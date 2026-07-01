@echo off
cd /d "%~dp0.."

set "NGROK_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"

if not exist "%NGROK_EXE%" (
  echo ngrok belum terinstall. Jalankan: winget install Ngrok.Ngrok
  exit /b 1
)

echo Memulai ngrok tunnel port 3000...
echo Dashboard ngrok: http://127.0.0.1:4040
echo.
echo PENTING: edit scripts\ngrok.yml — ganti domain dengan dev domain Anda
echo   (dashboard.ngrok.com -^> Domains, contoh: abc123.ngrok-free.dev)
echo.
echo Pastikan frontend sudah jalan: npm run dev:ngrok
echo Setelah URL https muncul, jalankan: scripts\sync-ngrok-env.cmd
echo.

"%NGROK_EXE%" start talap-fe --config scripts\ngrok.yml
