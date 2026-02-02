import mongoose from "mongoose";

const userStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    statusText: {
      type: String,
      default: "Hey there!",
      maxLength: 150,
    },
    statusImage: {
      type: String,
      default: "",
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    viewers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-delete expired statuses
userStatusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserStatus = mongoose.model("UserStatus", userStatusSchema);

export default UserStatus;
