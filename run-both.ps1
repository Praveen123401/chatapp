# Chat App - Backend & Frontend Launcher (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chat App - Backend & Frontend Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[BACKEND] Starting backend server on port 5002..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    wsl -d Ubuntu-24.04 -- bash -c "cd ~/chat-app/Backend && npm run dev"
}

Write-Host "[WAITING] Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "[FRONTEND] Starting frontend dev server on port 5173..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    wsl -d Ubuntu-24.04 -- bash -c "cd ~/chat-app/Frontend/vite-project && npm run dev"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend PID:  $($backendJob.Id)" -ForegroundColor Green
Write-Host "Frontend PID: $($frontendJob.Id)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Services Running:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5002" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Magenta
Write-Host ""

# Wait for both jobs
$backendJob, $frontendJob | Wait-Job

Write-Host ""
Write-Host "Services stopped" -ForegroundColor Yellow
