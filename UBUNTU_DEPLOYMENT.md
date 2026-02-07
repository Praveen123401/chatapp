# 🐧 Ubuntu Server Deployment Guide

## Prerequisites
- Ubuntu 20.04 or later
- SSH access to your server
- Domain name (optional but recommended)

---

## Step 1: Server Setup

### Connect to Ubuntu Server
```bash
ssh root@your_server_ip
```

### Update System
```bash
apt update && apt upgrade -y
apt install -y curl git wget npm nodejs
```

### Install Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
node --version  # Verify installation
```

### Install MongoDB (if using local MongoDB)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

---

## Step 2: Deploy Backend

### Clone Repository
```bash
cd /var/www
git clone https://github.com/yourusername/chat-app.git
cd chat-app/Backend
```

### Install Dependencies
```bash
npm install
```

### Create .env File
```bash
nano .env
```

Add your configuration:
```env
PORT=5002
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatdb
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URLS=https://yourdomain.com,https://www.yourdomain.com
```

### Install PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start src/index.js --name "chat-backend"
pm2 startup
pm2 save
```

### Verify Backend is Running
```bash
pm2 logs chat-backend
```

---

## Step 3: Deploy Frontend

### Build Frontend
```bash
cd /var/www/chat-app/Frontend/vite-project
npm install
npm run build
```

### Configure for Production
Update [vite-project/src/lib/axios.js](vite-project/src/lib/axios.js):
```javascript
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://yourdomain.com/api"
    : "http://localhost:5002/api",
  withCredentials: true,
});
```

### Copy to Backend Static Files
```bash
cp -r dist/* /var/www/chat-app/Backend/dist/
```

---

## Step 4: Set Up Nginx (Reverse Proxy)

### Install Nginx
```bash
apt install -y nginx
```

### Create Nginx Configuration
```bash
nano /etc/nginx/sites-available/chat-app
```

Add this configuration:
```nginx
upstream backend {
    server 127.0.0.1:5002;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # API Proxy
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_request_buffering off;
        proxy_read_timeout 86400;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend
    location / {
        proxy_pass http://backend;
        try_files $uri $uri/ /index.html;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable Site
```bash
ln -s /etc/nginx/sites-available/chat-app /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

---

## Step 5: SSL Certificate (Let's Encrypt)

### Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Generate Certificate
```bash
certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### Auto-Renewal
```bash
systemctl enable certbot.timer
systemctl start certbot.timer
```

---

## Step 6: Firewall Setup

### Enable UFW
```bash
ufw enable
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
```

---

## Step 7: Environment-Specific Fixes

### Common Linux Issues

**1. Permission Denied on Files**
```bash
chmod +x /var/www/chat-app/Backend/src/index.js
chown -R www-data:www-data /var/www/chat-app
```

**2. Port Already in Use**
```bash
lsof -i :5002          # Check what's using port
kill -9 <PID>          # Kill process
```

**3. MongoDB Connection Issues**
```bash
# Check MongoDB status
systemctl status mongod

# View logs
tail -f /var/log/mongodb/mongod.log
```

**4. File Upload Directory**
```bash
mkdir -p /var/www/chat-app/Backend/files
chmod 755 /var/www/chat-app/Backend/files
```

---

## Step 8: Monitoring & Logs

### Backend Logs
```bash
pm2 logs chat-backend
pm2 monit
```

### Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check Services
```bash
systemctl status nginx
systemctl status mongod
pm2 status
```

---

## Step 9: Database Backup

### MongoDB Backup
```bash
# Create backup
mongodump --out /backups/chatdb-$(date +%Y%m%d)

# Restore from backup
mongorestore /backups/chatdb-YYYYMMDD
```

---

## Step 10: Performance Optimization

### Enable Redis (Optional Cache)
```bash
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server
```

### Monitor Server Resources
```bash
top
df -h              # Disk usage
free -h             # Memory usage
netstat -tlnp       # Open ports
```

---

## Troubleshooting Checklist

- [ ] Backend running on port 5002
- [ ] Frontend built and served
- [ ] Nginx proxy configured
- [ ] SSL certificate installed
- [ ] MongoDB connected
- [ ] File permissions correct
- [ ] Firewall rules set
- [ ] PM2 process manager active
- [ ] Environment variables set
- [ ] Logs checked for errors

---

## Quick Commands Reference

```bash
# Restart all services
pm2 restart chat-backend
systemctl restart nginx

# View real-time logs
pm2 logs -f

# Rebuild frontend
cd Frontend/vite-project && npm run build

# Check system status
pm2 status && systemctl status nginx

# Clear PM2
pm2 kill && pm2 start src/index.js --name "chat-backend"
```

---

## Production Checklist

- ✅ Use environment variables for secrets
- ✅ Enable HTTPS/SSL
- ✅ Set NODE_ENV=production
- ✅ Use PM2 for process management
- ✅ Configure Nginx as reverse proxy
- ✅ Set up firewall rules
- ✅ Enable logging and monitoring
- ✅ Regular database backups
- ✅ Monitor disk space
- ✅ Keep packages updated

---

Happy Deployment! 🚀
