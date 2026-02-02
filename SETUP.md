# 🚀 Quick Setup Guide

## 1️⃣ Install Dependencies

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend/vite-project
npm install
```

## 2️⃣ Configure Environment

### Backend `.env`
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-key-123
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5002/api
```

## 3️⃣ Start the App

### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd Frontend/vite-project
npm run dev
```

## 4️⃣ Login with Demo Account

- **Email:** emma.thompson@example.com
- **Password:** 123456

Or create a new account!

## 📱 Features Quick Demo

### 💬 Send a Message
1. Select a contact from left sidebar
2. Type message
3. Click send (or Ctrl+Enter)

### 🎞️ Send Image/Video
- Click image icon
- Select file
- It uploads to Cloudinary automatically
- Message sends with preview

### 🎤 Record Voice Message
- Click microphone icon
- Start recording
- Click to stop
- Sends automatically with duration

### 👥 Create Group Chat
- Click "New Group" button
- Enter group name
- Select members
- Create

### 🔍 Search Messages
- Click search icon in header
- Type keyword
- Results show up instantly

### ⚙️ Customize Theme
1. Open Settings page
2. Choose theme (light/dark)
3. Select primary color
4. Upload wallpaper
5. Adjust font size
6. Save

### 📞 Call Buttons
- Voice call icon (ready for WebRTC)
- Video call icon (ready for WebRTC)

## 🎨 Styling

All components now use custom CSS with:
- ✅ Dark modern theme
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Hover effects
- ✅ Mobile optimized

## 🗄️ Database Models

### Message Fields
```javascript
{
  senderId,        // User who sent
  receiverId,      // Direct recipient
  groupId,         // If group message
  text,            // Message content
  image,           // Image URL
  video,           // Video URL
  audioMessage: {  // Voice message
    url,
    duration
  },
  document: {      // File
    url,
    name,
    size
  },
  location: {      // GPS location
    latitude,
    longitude,
    address
  },
  status,          // sent/delivered/read
  readBy,          // Array of readers
  replyTo,         // Message being replied to
  reactions,       // Array of emoji reactions
  isEdited,        // Boolean
  deletedFor,      // Array of users (soft delete)
  deletedForEveryone, // Boolean (hard delete)
  messageType,     // text/image/video/voice_message/document/location
  timestamps       // createdAt, updatedAt
}
```

### User Status Fields
```javascript
{
  userId,          // Reference to user
  statusText,      // Status message
  statusImage,     // Status image URL
  statusUpdatedAt, // When updated
  expiresAt,       // Auto-deletes after 24h
  viewers: [{      // Who viewed
    userId,
    viewedAt
  }]
}
```

### Chat Theme Fields
```javascript
{
  userId,          // Reference to user
  theme,           // light/dark/system
  primaryColor,    // Hex color
  backgroundColor, // Hex color
  chatWallpaper,   // Image URL
  fontSize,        // small/medium/large
  notifications: {
    enabled,
    sound,
    vibration
  },
  privacy: {
    lastSeenVisible,
    onlineStatusVisible,
    profilePhotoVisible
  }
}
```

## 🔌 Socket Events Reference

```javascript
// Listen for new messages
socket.on('newMessage', (message) => {
  // Handle incoming message
});

// Listen for typing
socket.on('typing', ({ userId }) => {
  // Show typing indicator
});

// Listen for read receipts
socket.on('messageRead', ({ messageId, userId }) => {
  // Update message status
});

// Listen for online users
socket.on('getOnlineUsers', (users) => {
  // Update online status
});

// Listen for group messages
socket.on('groupMessage', (message) => {
  // Handle group message
});
```

## 🐛 Troubleshooting

### Messages not loading?
- Check MongoDB connection
- Verify API URL in frontend .env
- Check console for errors

### Images not uploading?
- Verify Cloudinary credentials
- Check file size (max 50MB)
- Check internet connection

### Real-time not working?
- Check WebSocket connection
- Verify Socket.io in Network tab
- Check firewall settings

### Login issues?
- Clear browser cache
- Check MongoDB user collection
- Try demo account: emma.thompson@example.com / 123456

## 📦 Build for Production

```bash
# Frontend build
cd Frontend/vite-project
npm run build

# Backend is already production-ready
```

## ✅ Checklist Before Publishing

- [ ] Test all features
- [ ] Check responsive design (mobile/tablet)
- [ ] Verify all API endpoints
- [ ] Test WebSocket connections
- [ ] Verify image uploads
- [ ] Test on multiple browsers
- [ ] Check error handling
- [ ] Review security settings
- [ ] Update environment variables
- [ ] Test with production database

---

**You're all set! 🎉 Start building amazing features!**
