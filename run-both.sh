#!/bin/bash

# Chat App - Backend & Frontend Launcher for WSL
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Chat App - Backend & Frontend Launcher   ║${NC}"
echo -e "${CYAN}║         Running in WSL Ubuntu 24.04        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Kill existing processes
pkill -f 'node.*index.js' 2>/dev/null || true
pkill -f 'vite' 2>/dev/null || true
sleep 1

# Start backend
echo -e "${GREEN}[BACKEND]${NC} Starting backend server..."
cd /home/p/chat-app/Backend
npm run dev &
BACKEND_PID=$!
sleep 3

# Start frontend
echo -e "${YELLOW}[FRONTEND]${NC} Starting frontend dev server..."
cd /home/p/chat-app/Frontend/vite-project
npm run dev &
FRONTEND_PID=$!
sleep 2

echo ""
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Backend:  http://localhost:5002 (PID: $BACKEND_PID)${NC}"
echo -e "${YELLOW}✓ Frontend: http://localhost:5173 (PID: $FRONTEND_PID)${NC}"
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo ""
echo -e "${MAGENTA}Press Ctrl+C to stop${NC}"
echo ""

# Cleanup function
cleanup() {
    echo -e "${MAGENTA}Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
