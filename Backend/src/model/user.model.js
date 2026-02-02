import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        resetOtp: { type: String },
        resetOtpExpire: { type: Date },
        resetOtpAttempts: { type: Number, default: 0 },





        profilepic: { type: String, default: "" },
        isOnline: { type: Boolean, default: false },
        lastSeen: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["online", "offline", "away", "busy"],
            default: "offline"
        },
        socketId: { type: String, default: "" },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;  

