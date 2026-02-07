@echo off
REM Chat App - Backend & Frontend Launcher for Windows

color 0B
echo.
echo ========================================
echo Chat App - Backend and Frontend Launcher
echo ========================================
echo.

REM Start Backend in a new window
echo [BACKEND] Starting backend server on port 5002...
start "Chat App - Backend" wsl -d Ubuntu-24.04 -- bash -c "cd ~/chat-app/Backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend in a new window
echo [FRONTEND] Starting frontend dev server on port 5173...
start "Chat App - Frontend" wsl -d Ubuntu-24.04 -- bash -c "cd ~/chat-app/Frontend/vite-project && npm run dev"

echo.
echo ========================================
echo Services Starting:
echo   Backend:  http://localhost:5002
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Both services are running in separate windows.
echo Close the windows to stop each service.
pause
