@echo off
echo ====================================
echo    Starting Travelobia Backend
echo ====================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting backend server...
echo Backend will run on: http://localhost:5000
echo Frontend should run on: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ====================================
call npm run dev
pause
