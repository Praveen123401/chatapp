import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Return users with online status, lastSeen, and profilepic
    const usersWithStatus = filteredUsers.map(user => ({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      profilepic: user.profilepic,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, status: { $ne: "read" } },
      { $set: { status: "delivered" } }
    );

    const deliveredMessages = await Message.find({
      senderId: userToChatId,
      receiverId: myId,
      status: "delivered",
    });

    const senderSocketId = getReceiverSocketId(userToChatId);
    if (senderSocketId) {
      deliveredMessages.forEach((msg) => {
        io.to(senderSocketId).emit("messageUpdated", msg);
      });
    }

    const messages = await Message.find({
      $and: [
        {
          $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
          ],
        },
        { deletedFor: { $ne: myId } },
      ],
    }).populate("replyTo", "text senderId image deletedForEveryone");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo, audioMessage, messageType } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let audioUrl;
    if (audioMessage?.audio) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(audioMessage.audio, {
          resource_type: "auto",
        });
        audioUrl = uploadResponse.secure_url;
      } catch (error) {
        console.log("Error uploading audio:", error.message);
        return res.status(500).json({ error: "Failed to upload audio" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      audioMessage: audioUrl ? { url: audioUrl, duration: audioMessage.duration } : undefined,
      messageType: messageType || (audioUrl ? "voice_message" : "text"),
      replyTo,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "replyTo",
      "text senderId image deletedForEveryone"
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.text = text ?? message.text;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in editMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { forEveryone } = req.query;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (forEveryone === "true") {
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      message.deletedForEveryone = true;
      message.text = "";
      message.image = "";
      message.reactions = [];
      await message.save();
    } else {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
    }

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", {
        messageId: message._id,
        deletedForEveryone: message.deletedForEveryone,
        deletedFor: message.deletedFor,
      });
    }

    res.status(200).json({ success: true, messageId: message._id });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const existingIndex = message.reactions.findIndex(
      (reaction) =>
        reaction.userId.toString() === userId.toString() &&
        reaction.emoji === emoji
    );

    if (existingIndex >= 0) {
      message.reactions.splice(existingIndex, 1);
    } else {
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in toggleReaction controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
