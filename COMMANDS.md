# 🚀 Command Reference & Cheatsheet

## 🎯 Getting Started

### First Time Setup
```bash
# Clone repo
git clone <your-repo-url>
cd chat-app

# Install dependencies
cd Backend && npm install
cd ../Frontend/vite-project && npm install

# Configure environment variables
# Create .env files in Backend/ and Frontend/vite-project/

# Start development servers
# Terminal 1
cd Backend && npm run dev

# Terminal 2
cd Frontend/vite-project && npm run dev
```

---

## 📝 Common Commands

### Backend Commands
```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Seed demo data
npm run seed

# Check logs
npm run logs

# Kill process on port 5002
npx kill-port 5002
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Check types
npm run type-check
```

---

## 🔌 MongoDB Commands

### Start MongoDB
```bash
# Windows (with installed MongoDB)
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo
```

### MongoDB CLI
```bash
# Connect to local database
mongo

# Show databases
show dbs

# Use specific database
use chat-app

# Show collections
show collections

# View documents
db.users.find().pretty()

# Count documents
db.messages.countDocuments()

# Clear collection
db.messages.deleteMany({})

# Drop database
db.dropDatabase()
```

---

## 🔐 Environment Setup

### Backend .env Template
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-key-change-this-in-production
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend .env Template
```env
VITE_API_URL=http://localhost:5002/api
VITE_SOCKET_URL=http://localhost:5002
```

---

## 🧪 Testing Checklist

### Manual Test Cases
```
[ ] User Registration
  - Create new account
  - Verify email validation
  - Check password requirements
  
[ ] User Login
  - Login with correct credentials
  - Reject wrong password
  - Remember session

[ ] Direct Messages
  - Send text message
  - Send image
  - Send video
  - Record voice message
  - Receive real-time message
  
[ ] Group Chat
  - Create group
  - Add member
  - Send group message
  - Remove member
  - Rename group
  
[ ] Message Actions
  - Reply to message
  - Edit message
  - Delete for self
  - Delete for everyone
  - Add reaction
  
[ ] User Status
  - Update status
  - View contact status
  - Status expires after 24h
  
[ ] Search
  - Search messages
  - Search users
  - Search groups
  
[ ] Settings
  - Change theme
  - Update notification settings
  - Change privacy settings
  
[ ] Responsive Design
  - Test on mobile (375px)
  - Test on tablet (768px)
  - Test on desktop (1920px)
```

---

## 🐛 Debugging Tips

### Enable Detailed Logging
```javascript
// In store files
console.log('Action:', payload);

// In API calls
const response = await axios.post('/api/...');
console.log('Response:', response.data);

// In Socket events
socket.on('newMessage', (msg) => {
  console.log('Message received:', msg);
});
```

### Chrome DevTools
```
1. Open DevTools: F12
2. Network Tab: Monitor API calls
3. Console: Check for errors
4. Application → Storage → Check cookies/localStorage
5. Socket.io Inspector: Check real-time events
```

### MongoDB Compass
```
1. Download: https://www.mongodb.com/products/compass
2. Connect: mongodb://localhost:27017
3. Browse collections
4. View documents
5. Run queries
6. Export data
```

---

## 📦 Build & Deploy

### Production Build
```bash
# Frontend
cd Frontend/vite-project
npm run build
# Output: dist/ folder

# Backend
# Already ready (no build needed)
```

### Deploy to Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Railway/Heroku (Backend)
```bash
# Create account at railway.app or heroku.com

# Railway
railway login
railway init
railway up

# Heroku
heroku login
heroku create your-app-name
git push heroku main
```

---

## 🔧 Git Commands

### Basic Git Workflow
```bash
# Initialize repo
git init

# Add files
git add .

# Commit
git commit -m "feat: add new feature"

# Create branch
git checkout -b feature/new-feature

# Push
git push origin feature/new-feature

# Pull request (on GitHub)

# Merge
git checkout main
git merge feature/new-feature
```

### Useful Git Commands
```bash
# Check status
git status

# View log
git log --oneline

# Undo changes
git checkout .

# Reset to commit
git reset --hard <commit-hash>

# Stash changes
git stash

# Apply stashed changes
git stash apply
```

---

## 🚨 Troubleshooting Commands

### Reset Everything
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Clear browser cache
# DevTools → Application → Clear site data
```

### Port Already in Use
```bash
# Find process on port 5002 (Backend)
netstat -ano | findstr :5002

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use npx
npx kill-port 5002

# Kill port 5173 (Frontend)
npx kill-port 5173
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
netstat -an | grep 27017

# Restart MongoDB
# Windows
net stop MongoDB
net start MongoDB

# macOS
brew services restart mongodb-community
```

### Clear Database
```bash
# Connect to MongoDB
mongo

# Drop entire database
use chat-app
db.dropDatabase()

# Exit
exit
```

---

## 📊 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze

# Measure performance
# DevTools → Lighthouse

# Check bundle
npm install -g webpack-bundle-analyzer
```

### Backend
```bash
# Enable compression
npm install compression

# Database indexing (already in models)
db.messages.createIndex({ senderId: 1 })
db.messages.createIndex({ createdAt: -1 })

# Monitor performance
npm install clinic
clinic doctor -- node src/index.js
```

---

## 📝 Commit Message Format

### Conventional Commits
```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Code formatting
refactor: Refactor code
perf: Improve performance
test: Add tests
chore: Maintenance tasks

Example:
git commit -m "feat: add voice message recording"
git commit -m "fix: resolve message search bug"
```

---

## 🔐 Security Checklist

```
[ ] Change JWT_SECRET to random string
[ ] Never commit .env files
[ ] Add .gitignore entries
[ ] Update MONGODB_URI to production server
[ ] Set CORS origin to production domain
[ ] Enable HTTPS in production
[ ] Add rate limiting
[ ] Validate all user inputs
[ ] Sanitize data before database
[ ] Use environment variables
[ ] Keep dependencies updated
[ ] Enable CSP headers
[ ] Add security headers
```

---

## 📞 Common Issues & Solutions

### "Cannot find module"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"
```bash
# Solution: Kill process or change port
npx kill-port 5002
# Or in .env: PORT=5003
```

### "CORS error"
```bash
# Solution: Check CORS config in Backend/src/index.js
# Ensure frontend URL is allowed
```

### "Database connection failed"
```bash
# Solution: Check MongoDB is running
# Verify MONGODB_URI in .env
# Check network connection
```

### "Images not uploading"
```bash
# Solution: Verify Cloudinary credentials
# Check file size (max 50MB)
# Verify image format
```

### "Messages not loading"
```bash
# Solution: Check API endpoint
# Verify Socket.io connection
# Check browser console for errors
```

---

## 💾 Backup Commands

### MongoDB Backup
```bash
# Backup database
mongodump --db chat-app --out ./backup

# Restore database
mongorestore ./backup/chat-app
```

### Git Backup
```bash
# Create backup branch
git branch backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)
```

---

## 📚 Learning Resources

```
MongoDB:      https://docs.mongodb.com
Express:      https://expressjs.com
React:        https://react.dev
Vite:         https://vitejs.dev
Socket.io:    https://socket.io/docs
Tailwind:     https://tailwindcss.com
Cloudinary:   https://cloudinary.com/documentation
Zustand:      https://github.com/pmndrs/zustand
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` (both) |
| Build prod | `npm run build` |
| View logs | `npm run logs` |
| Test code | `npm test` |
| Format | `npm run format` |
| Kill port | `npx kill-port 5002` |
| Reset DB | `mongo` → `db.dropDatabase()` |
| Check status | `git status` |
| Deploy | `vercel` or `railway up` |

---

**Happy coding! 🚀**
