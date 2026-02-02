import mongoose from "mongoose";

const chatThemeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "dark",
    },
    primaryColor: {
      type: String,
      default: "#3b82f6",
    },
    backgroundColor: {
      type: String,
      default: "#0f172a",
    },
    chatWallpaper: {
      type: String,
      default: "", // URL to wallpaper image
    },
    fontSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },
    notifications: {
      enabled: { type: Boolean, default: true },
      sound: { type: Boolean, default: true },
      vibration: { type: Boolean, default: true },
    },
    privacy: {
      lastSeenVisible: { type: Boolean, default: true },
      onlineStatusVisible: { type: Boolean, default: true },
      profilePhotoVisible: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const ChatTheme = mongoose.model("ChatTheme", chatThemeSchema);

export default ChatTheme;
