import Group from "../model/group.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user._id;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const uniqueMembers = Array.from(new Set([userId.toString(), ...(members || [])]));

    const group = await Group.create({
      name: name.trim(),
      members: uniqueMembers,
      admins: [userId],
      createdBy: userId,
    });

    res.status(201).json(group);
  } catch (error) {
    console.log("Error in createGroup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).sort({ updatedAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getMyGroups controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(memberId)) {
      group.members.push(memberId);
      await group.save();
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in addMember controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    group.admins = group.admins.filter(
      (admin) => admin.toString() !== memberId
    );
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in removeMember controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { name } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.name = name?.trim() || group.name;
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in renameGroup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.some((member) => member.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const messages = await Message.find({ groupId })
      .populate("replyTo", "text senderId image deletedForEveryone")
      .populate("senderId", "fullName profilepic");
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { text, image, replyTo, audioMessage, messageType } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.some((member) => member.toString() === senderId.toString())) {
      return res.status(403).json({ message: "Not a group member" });
    }

    let imageUrl;
    if (image) {
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
        return res.status(500).json({ message: "Failed to upload audio" });
      }
    }

    const newMessage = await Message.create({
      senderId,
      text,
      image: imageUrl,
      audioMessage: audioUrl ? { url: audioUrl, duration: audioMessage.duration } : undefined,
      messageType: messageType || (audioUrl ? "voice_message" : "text"),
      groupId,
      replyTo,
    });

    const populated = await Message.findById(newMessage._id)
      .populate("replyTo", "text senderId image deletedForEveryone")
      .populate("senderId", "fullName profilepic");

    io.to(`group:${groupId}`).emit("groupMessage", populated);

    res.status(201).json(populated);
  } catch (error) {
    console.log("Error in sendGroupMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
