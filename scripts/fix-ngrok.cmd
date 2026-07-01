@echo off
setlocal
cd /d "%~dp0.."

echo ========================================
echo   Perbaikan ngrok TA-LAP
echo ========================================
echo.

echo [1] Sinkronkan jam Windows (penting untuk authtoken JWT)...
w32tm /resync
echo.

echo [2] Cek ngrok resmi dari winget...
set "NGROK_EXE=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"
if not exist "%NGROK_EXE%" (
  echo ngrok winget belum ada. Install dulu:
  echo   winget install Ngrok.Ngrok
  pause
  exit /b 1
)
"%NGROK_EXE%" version
echo.

echo [3] Hapus ngrok npm global agar tidak bentrok (abaikan error jika belum ada)...
call npm uninstall -g ngrok 2>nul
echo.

echo [4] Paste authtoken BARU dari dashboard ngrok:
echo     https://dashboard.ngrok.com/get-started/your-authtoken
echo     ^(bukan API Key^)
echo.
set /p TOKEN=Authtoken: 
if "%TOKEN%"=="" (
  echo Token kosong. Batal.
  pause
  exit /b 1
)

"%NGROK_EXE%" config add-authtoken %TOKEN%
if errorlevel 1 (
  echo.
  echo GAGAL. Coba:
  echo   - Login/verify email di dashboard ngrok
  echo   - Matikan VPN sementara
  echo   - Coba hotspot HP ^(jika WiFi kampus/ISP memblokir^)
  echo   - Sync jam: buka https://time.is lalu set jam Windows
  pause
  exit /b 1
)

echo.
"%NGROK_EXE%" config check
echo.
echo BERHASIL. Sekarang jalankan: scripts\start-ngrok.cmd
pause
