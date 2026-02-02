import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import ChatTheme from "../model/chatTheme.model.js";

const router = express.Router();

// Get user's chat theme settings
router.get("/", protectRoute, async (req, res) => {
  try {
    let theme = await ChatTheme.findOne({ userId: req.user._id });

    if (!theme) {
      theme = new ChatTheme({ userId: req.user._id });
      await theme.save();
    }

    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update chat theme
router.put("/", protectRoute, async (req, res) => {
  try {
    const { theme, primaryColor, backgroundColor, chatWallpaper, fontSize, notifications, privacy } = req.body;

    let chatTheme = await ChatTheme.findOne({ userId: req.user._id });

    if (!chatTheme) {
      chatTheme = new ChatTheme({ userId: req.user._id });
    }

    if (theme) chatTheme.theme = theme;
    if (primaryColor) chatTheme.primaryColor = primaryColor;
    if (backgroundColor) chatTheme.backgroundColor = backgroundColor;
    if (chatWallpaper) chatTheme.chatWallpaper = chatWallpaper;
    if (fontSize) chatTheme.fontSize = fontSize;
    if (notifications) chatTheme.notifications = { ...chatTheme.notifications, ...notifications };
    if (privacy) chatTheme.privacy = { ...chatTheme.privacy, ...privacy };

    await chatTheme.save();

    res.json({
      message: "Theme updated successfully",
      theme: chatTheme,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset to default theme
router.post("/reset", protectRoute, async (req, res) => {
  try {
    await ChatTheme.findOneAndDelete({ userId: req.user._id });

    const newTheme = new ChatTheme({ userId: req.user._id });
    await newTheme.save();

    res.json({
      message: "Theme reset to default",
      theme: newTheme,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
