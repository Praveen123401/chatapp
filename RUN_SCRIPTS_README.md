# Chat App - Run Both Services

This directory contains scripts to easily run both the backend and frontend services side-by-side.

## Available Scripts

### 1. **Windows Batch Script** (Recommended for Windows)
```bash
run-both.bat
```
- Opens both services in separate command windows
- Easiest way to run on Windows
- Services run independently with visible output
- Close either window to stop that service

**Usage:**
```cmd
Double-click run-both.bat
OR
C:\Users\prave\Desktop\chat-app\run-both.bat
```

### 2. **PowerShell Script**
```bash
run-both.ps1
```
- Modern PowerShell approach
- Runs both services as background jobs
- Requires PowerShell execution policy to allow scripts

**Usage:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\run-both.ps1
```

### 3. **Bash Script** (For WSL/Linux)
```bash
run-both.sh
```
- For use within WSL Ubuntu or Linux environment
- Runs both services with colored output
- Press Ctrl+C to stop both services

**Usage:**
```bash
chmod +x run-both.sh
./run-both.sh
# OR
bash run-both.sh
```

## Services

Once running, access:

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:5173 | 5173 |
| **Backend API** | http://localhost:5002 | 5002 |

## What Each Script Does

All scripts perform the same operations:
1. **Backend**: Runs `npm run dev` in `/Backend` directory (nodemon)
2. **Frontend**: Runs `npm run dev` in `/Frontend/vite-project` directory (Vite)
3. Both services start in WSL Ubuntu 24.04
4. Services are monitored and logged in separate windows/jobs

## Stopping Services

| Script | How to Stop |
|--------|-------------|
| **Batch (.bat)** | Close the backend and frontend windows |
| **PowerShell (.ps1)** | Press Ctrl+C in the terminal |
| **Bash (.sh)** | Press Ctrl+C in the terminal |

## Default Credentials (Demo)

Test the app using:
- **Email**: emma.thompson@example.com
- **Password**: 123456

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5002 (Windows)
netstat -ano | findstr :5002
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Dependencies missing:**
```bash
# Backend
cd Backend && npm install

# Frontend
cd Frontend/vite-project && npm install --legacy-peer-deps
```

**MongoDB connection issues:**
Ensure `.env` file in Backend has correct MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
```

## Project Structure

```
chat-app/
├── Backend/
│   ├── package.json
│   └── src/
│       └── index.js
├── Frontend/
│   └── vite-project/
│       ├── package.json
│       └── src/
├── run-both.bat      ← Run this on Windows
├── run-both.ps1      ← Or this (PowerShell)
└── run-both.sh       ← Or this (WSL/Linux)
```

---

**Created**: February 5, 2026
**Environment**: WSL Ubuntu 24.04
**Node.js**: v20.20.0
**npm**: v10.8.2
