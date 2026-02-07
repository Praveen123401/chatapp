# Chat App - Full Network Access Setup

Your chat application is now configured to be accessible from ANY network!

## Your Machine Information

```
Windows Machine IP:  10.14.146.151
Machine Hostname:    [Your Computer Name]
Backend Port:        5002
Frontend Port:       5173
```

## Access URLs

### From Your Computer (Same Network):
```
Frontend:  http://10.14.146.151:5173
Backend:   http://10.14.146.151:5002/api
```

### From Mobile/Tablet on Same WiFi:
```
Frontend:  http://10.14.146.151:5173
Backend:   http://10.14.146.151:5002/api
```

### From Another Computer on LAN:
```
Frontend:  http://10.14.146.151:5173
Backend:   http://10.14.146.151:5002/api
```

### From Internet (Requires Port Forwarding):
```
Frontend:  http://[YOUR_PUBLIC_IP]:5173
Backend:   http://[YOUR_PUBLIC_IP]:5002/api
```

## Configuration Applied

### Backend (index.js)
✅ CORS: Allows all origins (`origin: "*"`)  
✅ Listening: All interfaces (`0.0.0.0:5002`)  
✅ Credentials: Disabled (required for `*` origin)  

### Frontend (vite.config.js)
✅ Host: All interfaces (`0.0.0.0`)  
✅ Proxy: Routes to backend IP (`http://10.14.146.151:5002`)  

### Windows Network
✅ Firewall: Disabled  
✅ Port Forwarding: Active (5002 & 5173 → WSL)  

## Test Credentials

```
Email:    emma.thompson@example.com
Password: 123456
```

## How to Access from Different Networks

### Same WiFi Network (Recommended)
1. On mobile/tablet, connect to same WiFi as your computer
2. Open browser and go to: `http://10.14.146.151:5173`
3. Login with test credentials
4. Start chatting!

### Different WiFi Network (Mobile Hotspot)
1. Your computer connects to phone hotspot
2. Access via: `http://10.14.146.151:5173`
3. Works if both are on same hotspot network

### From Internet (Requires Setup)
1. Note your public IP from: https://whatsmyipaddress.com/
2. Configure port forwarding on your router:
   - Forward port 5002 → 10.14.146.151:5002
   - Forward port 5173 → 10.14.146.151:5173
3. Access via: `http://[YOUR_PUBLIC_IP]:5173`

## Finding Your Machine IP

**From Command Prompt:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your network adapter (usually starts with 192.168 or 10.x.x.x)

**From WSL:**
```bash
wsl -d Ubuntu-24.04 -- bash -c "ip route get 1 | awk '{print \$7;exit}'"
```

## Security Notes (Development Only)

⚠️ **Important for Production:**
- CORS is set to allow all origins (`*`) - suitable for development
- For production, specify allowed origins in CORS
- Never expose on public internet without authentication
- Use HTTPS/SSL for sensitive data

## Running Services

**Start Services:**
```bash
wsl -d Ubuntu-24.04 -- bash /home/p/run-both.sh
```

**Stop Services:**
```
Press Ctrl+C in the terminal
```

## Troubleshooting

### Can't connect from mobile on same WiFi?
1. Verify both devices on same WiFi network
2. Try: `ping 10.14.146.151` from mobile
3. Check Windows Firewall (should be disabled)
4. Check backend logs for errors

### Port not accessible?
```cmd
netstat -ano | findstr :5002
netstat -ano | findstr :5173
```

### Check port forwarding:
```cmd
netsh interface portproxy show v4tov4
```

### Reset everything:
```bash
# Kill all services
wsl -d Ubuntu-24.04 -- bash -c "pkill -9 node; pkill -9 npm"

# Restart
wsl -d Ubuntu-24.04 -- bash /home/p/run-both.sh
```

## Features Enabled

✅ Real-time messaging (Socket.io)  
✅ File uploads (Cloudinary)  
✅ Profile management  
✅ Group chats  
✅ Call history  
✅ Theme customization  
✅ User status  

---

**Created**: February 5, 2026  
**Environment**: WSL Ubuntu 24.04  
**Server IP**: 10.14.146.151  
**Accessibility**: Full Network Access Enabled  
