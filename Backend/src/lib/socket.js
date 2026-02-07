import "../config/env.js";
import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import Group from "../model/group.model.js";

const app = express();
const server = http.createServer(app);

const socketFrontendUrls = (process.env.FRONTEND_URLS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === "true";

const io = new Server(server, {
  cors: {
    origin: allowAllOrigins ? true : socketFrontendUrls,
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getOnlineUsers() {
  return Object.keys(userSocketMap);
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;

    User.findByIdAndUpdate(userId, {
      isOnline: true,
      status: "online",
      socketId: socket.id,
      lastSeen: new Date(),
    }).catch((error) => {
      console.error("Error updating user status:", error.message);
    });

    Group.find({ members: userId })
      .then((groups) => {
        groups.forEach((group) => socket.join(`group:${group._id}`));
      })
      .catch((error) => {
        console.error("Error joining group rooms:", error.message);
      });
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", getOnlineUsers());

  socket.on("typing", ({ receiverId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (!receiverSocketId) return;
    io.to(receiverSocketId).emit("userTyping", {
      senderId: userId,
      isTyping,
    });
  });

  socket.on("messageRead", async ({ messageId, senderId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, {
        status: "read",
        $addToSet: { readBy: { userId, readAt: new Date() } },
      });
    } catch (error) {
      console.error("Error updating read receipt:", error.message);
    }

    const senderSocketId = getReceiverSocketId(senderId);
    if (!senderSocketId) return;
    io.to(senderSocketId).emit("messageReadReceipt", {
      messageId,
      readBy: userId,
      readAt: new Date(),
    });
  });

  socket.on("joinGroup", (groupId) => {
    if (!groupId) return;
    socket.join(`group:${groupId}`);
  });

  // ============= CALL EVENTS =============
  socket.on("callUser", ({ receiverId, callType, callerInfo }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (!receiverSocketId) {
      socket.emit("callFailed", { message: "User is offline" });
      return;
    }

    io.to(receiverSocketId).emit("incomingCall", {
      callerId: userId,
      callType,
      callerInfo,
      callerSocketId: socket.id,
    });
  });

  socket.on("acceptCall", ({ callerId }) => {
    const callerSocketId = getReceiverSocketId(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAccepted", {
        receiverId: userId,
        receiverSocketId: socket.id,
      });
    }
  });

  socket.on("rejectCall", ({ callerId }) => {
    const callerSocketId = getReceiverSocketId(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected", {
        message: "Call was rejected",
      });
    }
  });

  socket.on("endCall", ({ otherUserId }) => {
    const otherUserSocketId = getReceiverSocketId(otherUserId);
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit("callEnded", {
        message: "Call ended",
      });
    }
  });

  socket.on("sendSignal", ({ signal, to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveSignal", {
        signal,
        from: userId,
        socketId: socket.id,
      });
    }
  });

  socket.on("returnSignal", ({ signal, to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveReturnSignal", {
        signal,
        from: userId,
        socketId: socket.id,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", getOnlineUsers());

      User.findByIdAndUpdate(userId, {
        isOnline: false,
        status: "offline",
        socketId: "",
        lastSeen: new Date(),
      }).catch((error) => {
        console.error("Error updating user disconnect:", error.message);
      });
    }
  });
});

export { io, app, server };
