# Chat App - Network Access Guide

Your chat application is now configured to be accessible across your local network and from other devices!

## Your Network Information

| Item | Value |
|------|-------|
| **Windows Machine IP** | 10.14.146.151 |
| **WSL Gateway** | 172.19.32.1 |
| **Backend Port** | 5002 |
| **Frontend Port** | 5173 |

## Access URLs

### From Same Computer:
- **Frontend (Localhost)**: http://localhost:5173
- **Backend (Localhost)**: http://localhost:5002/api
- **Frontend (Network IP)**: http://10.14.146.151:5173
- **Backend (Network IP)**: http://10.14.146.151:5002/api

### From Other Devices on Same Network:
- **Frontend**: http://10.14.146.151:5173
- **Backend**: http://10.14.146.151:5002/api

## Test Credentials

```
Email: emma.thompson@example.com
Password: 123456
```

## Configuration Details

### Backend (src/index.js)
- ✅ Listening on all interfaces: `0.0.0.0:5002`
- ✅ CORS enabled for network IPs:
  - `http://localhost:5173`
  - `http://localhost:5174`
  - `http://10.14.146.151:5173`
  - `http://10.14.146.151:3000`

### Frontend (.env)
- ✅ API endpoint: `http://10.14.146.151:5002/api`
- ✅ Auto-configured for network access

## Running the Services

### From WSL Terminal:
```bash
bash /home/p/run-both.sh
```

### From Windows PowerShell:
```powershell
C:\Users\prave\Desktop\chat-app\run-both.bat
```

## Firewall Configuration (if needed)

If you can't connect from another device, you may need to allow port 5002 through Windows Firewall:

**PowerShell (Run as Administrator):**
```powershell
New-NetFirewallRule -DisplayName "Chat App Backend" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5002
```

Or manually add the rule in:
- Windows Defender Firewall → Inbound Rules → New Rule
- Port: 5002
- Allow connections from your network

## Testing from Another Device

1. On another computer on the same network, open a browser
2. Navigate to: `http://10.14.146.151:5173`
3. Login with test credentials
4. Try sending messages - they should sync in real-time

## Troubleshooting

### Can't connect from other devices?

1. **Check firewall:**
   ```powershell
   netstat -ano | findstr :5002
   ```

2. **Verify service is running:**
   ```bash
   # From WSL
   lsof -i :5002
   lsof -i :5173
   ```

3. **Check network connectivity:**
   ```cmd
   ping 10.14.146.151
   ```

4. **Allow port through firewall (Windows):**
   - Settings → Privacy & Security → Windows Defender Firewall → Allow an app through firewall
   - Click "Change settings"
   - Add port 5002 for Private networks

## Advanced: Using with a Real Domain

To access from internet (requires port forwarding and domain):

1. Port forward port 5002 on your router
2. Get a domain name
3. Update CORS origins in `Backend/src/index.js`
4. Update `VITE_API_URL` in `Frontend/vite-project/.env`

---

**Created**: February 5, 2026  
**Environment**: WSL Ubuntu 24.04 on Windows 10/11  
**Your IP**: 10.14.146.151  
