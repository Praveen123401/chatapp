// // import mongoose from "mongoose";

// // const messageSchema = new mongoose.Schema(
// //     {
// //         senderId: {
// //             type: mongoose.Schema.Types.ObjectId,
// //             ref: "User",
// //             required: true
// //         },
// //         receiverId: {
// //             type: mongoose.Schema.Types.ObjectId,
// //             ref: "User",
// //             required: true
// //         },
// //         text: { type: String, required: true }
// //     },
// //     { timestamps: true }
// // );

// // const Message = mongoose.model("Message", messageSchema);
// // export default Message;
// // import Message from "../model/message.model.js"; // (circular import, likely not needed)
// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       default: "",
//     },
//     image: {
//       type: String,
//       default: "",
//     },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);

// export default Message;  

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    audioMessage: {
      url: { type: String, default: "" },
      duration: { type: Number, default: 0 },
    },
    document: {
      url: { type: String, default: "" },
      name: { type: String, default: "" },
      size: { type: Number, default: 0 },
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    readBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String },
      },
    ],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletedForEveryone: { type: Boolean, default: false },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "voice_message", "document", "location"],
      default: "text",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

