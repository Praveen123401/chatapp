$ErrorActionPreference = "SilentlyContinue"

Write-Host "Setting up WSL port forwarding..." -ForegroundColor Cyan

# Get WSL IP
$wslIp = wsl -d Ubuntu-24.04 -- bash -c "hostname -I | awk '{print `$1}'"

Write-Host "WSL IP Address: $wslIp" -ForegroundColor Green

# Remove existing port proxies
netsh interface portproxy delete v4tov4 listenport=5002 listenaddress=0.0.0.0 2>$null
netsh interface portproxy delete v4tov4 listenport=5173 listenaddress=0.0.0.0 2>$null

Write-Host "Adding port proxy rules..." -ForegroundColor Yellow

# Add port proxies
netsh interface portproxy add v4tov4 listenport=5002 listenaddress=0.0.0.0 connectport=5002 connectaddress=$wslIp
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=$wslIp

Write-Host ""
Write-Host "Port forwarding configured!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your app at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://10.14.146.151:5173" -ForegroundColor Green
Write-Host "  Backend:  http://10.14.146.151:5002/api" -ForegroundColor Green
Write-Host ""

# Show port proxy rules
Write-Host "Current port proxy rules:" -ForegroundColor Yellow
netsh interface portproxy show v4tov4
