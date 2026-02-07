import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Chat Preferences
      enterToSend: true,
      mediaAutoDownload: false,
      soundEnabled: true,
      notificationsEnabled: true,
      messagePreview: true,
      
      // Privacy Settings
      readReceipts: true,
      lastSeen: true,
      profilePhoto: "everyone", // "everyone", "contacts", "nobody"
      about: "everyone",
      status: "everyone",
      
      // Theme Settings (Per-User and Per-Chat)
      perChatThemes: {}, // { userId: "themeName" }
      wallpapers: {}, // { userId: "wallpaperUrl" }
      
      // Chat Settings
      fontSize: "medium", // "small", "medium", "large"
      messageGrouping: true,
      showTimestamps: true,
      bubbleStyle: "modern", // "modern", "classic", "minimal"
      
      // Notification Settings
      messageSound: "default",
      vibration: true,
      popupNotifications: true,
      groupNotifications: true,
      
      // Storage Settings
      autoDeleteMessages: false,
      autoDeleteDays: 30,
      
      // Setters
      setEnterToSend: (value) => set({ enterToSend: value }),
      setMediaAutoDownload: (value) => set({ mediaAutoDownload: value }),
      setSoundEnabled: (value) => set({ soundEnabled: value }),
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
      setMessagePreview: (value) => set({ messagePreview: value }),
      
      setReadReceipts: (value) => set({ readReceipts: value }),
      setLastSeen: (value) => set({ lastSeen: value }),
      setProfilePhoto: (value) => set({ profilePhoto: value }),
      setAbout: (value) => set({ about: value }),
      setStatus: (value) => set({ status: value }),
      
      setPerChatTheme: (userId, theme) => 
        set((state) => ({
          perChatThemes: { ...state.perChatThemes, [userId]: theme }
        })),
      
      setWallpaper: (userId, wallpaper) =>
        set((state) => ({
          wallpapers: { ...state.wallpapers, [userId]: wallpaper }
        })),
      
      setFontSize: (size) => set({ fontSize: size }),
      setMessageGrouping: (value) => set({ messageGrouping: value }),
      setShowTimestamps: (value) => set({ showTimestamps: value }),
      setBubbleStyle: (style) => set({ bubbleStyle: style }),
      
      setMessageSound: (sound) => set({ messageSound: sound }),
      setVibration: (value) => set({ vibration: value }),
      setPopupNotifications: (value) => set({ popupNotifications: value }),
      setGroupNotifications: (value) => set({ groupNotifications: value }),
      
      setAutoDeleteMessages: (value) => set({ autoDeleteMessages: value }),
      setAutoDeleteDays: (days) => set({ autoDeleteDays: days }),
      
      // Get per-chat theme
      getChatTheme: (userId) => {
        const themes = get().perChatThemes;
        return themes[userId] || null;
      },
      
      // Get chat wallpaper
      getChatWallpaper: (userId) => {
        const wallpapers = get().wallpapers;
        return wallpapers[userId] || null;
      },
    }),
    {
      name: "chat-settings-storage",
    }
  )
);
