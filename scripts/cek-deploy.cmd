@echo off
echo ========================================
echo   Cek kesiapan deploy TA-LAP
echo ========================================
echo.

cd /d "%~dp0ta-lap-fe"
echo [1/2] Build frontend...
call npm run build
if errorlevel 1 (
  echo.
  echo GAGAL: Perbaiki error build dulu sebelum deploy Vercel.
  pause
  exit /b 1
)

cd /d "%~dp0ta-lap-be"
echo.
echo [2/2] Generate Prisma client...
call npx prisma generate
if errorlevel 1 (
  echo.
  echo GAGAL: Prisma generate error.
  pause
  exit /b 1
)

echo.
echo OK — Siap push ke GitHub dan deploy.
echo Baca panduan: DEPLOY.md
pause
