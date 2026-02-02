import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import UserStatus from "../model/userStatus.model.js";
import User from "../model/user.model.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Get user status
router.get("/status/:userId", protectRoute, async (req, res) => {
  try {
    const status = await UserStatus.findOne({ userId: req.params.userId })
      .populate("userId", "fullName profilePic")
      .populate("viewers.userId", "fullName profilePic");

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.put("/status", protectRoute, async (req, res) => {
  try {
    const { statusText, statusImage } = req.body;
    const userId = req.user._id;

    let imageUrl = statusImage;
    if (statusImage && statusImage.startsWith("data:")) {
      const uploadResponse = await cloudinary.uploader.upload(statusImage, {
        folder: "chat-app/status",
        resource_type: "auto",
      });
      imageUrl = uploadResponse.secure_url;
    }

    let status = await UserStatus.findOne({ userId });

    if (!status) {
      status = new UserStatus({
        userId,
        statusText,
        statusImage: imageUrl,
      });
    } else {
      status.statusText = statusText;
      if (imageUrl) status.statusImage = imageUrl;
      status.statusUpdatedAt = new Date();
      status.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    await status.save();

    res.json({
      message: "Status updated successfully",
      status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all statuses from contacts
router.get("/statuses", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const contacts = user.contacts || [];

    const statuses = await UserStatus.find({
      userId: { $in: contacts },
      expiresAt: { $gt: new Date() },
    })
      .populate("userId", "fullName profilePic")
      .sort({ statusUpdatedAt: -1 });

    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark status as viewed
router.post("/status/:statusId/view", protectRoute, async (req, res) => {
  try {
    const status = await UserStatus.findByIdAndUpdate(
      req.params.statusId,
      {
        $push: {
          viewers: {
            userId: req.user._id,
            viewedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete status
router.delete("/status/:statusId", protectRoute, async (req, res) => {
  try {
    const status = await UserStatus.findById(req.params.statusId);

    if (status.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await UserStatus.findByIdAndDelete(req.params.statusId);

    res.json({ message: "Status deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
