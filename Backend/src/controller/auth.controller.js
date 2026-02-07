import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../model/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import sendEmail from "../lib/sendEmail.js";

/* ===================== SIGNUP ===================== */
export const signup = async (req, res) => { 

  try {
    const { fullName, email, password, username } = req.body;

    // validation
    if (!fullName || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword,
    });

    // generate JWT cookie
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
      profilepic: newUser.profilepic,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res) => { 
  console.log('login debug - req.body:', req.body);
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); 
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password); 
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" }); 
    }
 
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/* ===================== LOGOUT ===================== */
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Support three ways to receive a profile picture:
    // 1) multipart file via multer -> req.file or req.files
    // 2) base64 data URL in JSON body -> req.body.profilePic
    // 3) (fallback) missing -> return 400

    // Prefer multer file(s) when present
    const file = req.file || (Array.isArray(req.files) && req.files[0]);

    let uploadResponse;

    if (file) {
      // upload disk file path to cloudinary
      uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: "profile_pics",
      });
    } else if (req.body?.profilePic && typeof req.body.profilePic === "string") {
      // If client sent a base64 data URL in JSON (e.g. 'data:image/png;base64,...')
      uploadResponse = await cloudinary.uploader.upload(req.body.profilePic, {
        folder: "profile_pics",
      });
    } else {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // update user profilePic URL
    console.log("Upload response:", uploadResponse.secure_url);
    const   profilePicUrl = uploadResponse.secure_url;  

    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { profilepic: profilePicUrl },
    //   { profilePic: profilePicUrl }

    //   { new: true }
    // ).select("-password");

    const updatedUser = await User.findByIdAndUpdate(
  userId,
  { profilePic: profilePicUrl }, // ✅ Fixed: capital P
  { new: true }
).select("-password");


    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => { 
  console.log('forgotPassword debug - req.body:', req.body);  
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp); // Debug log
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    console.log('Hashed OTP:', hashedOtp); // Debug log

    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 2 * 60 * 1000; // 2 minutes
    user.resetOtpAttempts = 0;
    console.log('User before saving OTP:', user); // Debug log
    await user.save();

    console.log("RESET OTP:", otp);

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.log("Error in forgotPassword:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Check OTP attempts
    if (user.resetOtpAttempts >= 5) {
      return res
        .status(429)
        .json({ message: "Too many attempts. Try again later." });
    }

    // 4️⃣ Check OTP expiry
    if (!user.resetOtp || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 5️⃣ Hash incoming OTP
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // 6️⃣ Compare OTP
    if (hashedOtp !== user.resetOtp) {
      user.resetOtpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 7️⃣ Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    // 8️⃣ Clear OTP fields (ONE-TIME USE)
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    user.resetOtpAttempts = 0;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

 



/* ===================== CHECK AUTH ===================== */
export const checkauth = async (req, res) => {
  try {
      console.log('checkauth debug - req.user exists:', !!req.user, req.user ? { _id: req.user._id, email: req.user.email } : null);
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
    console.log("Error in checkauth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
// } 
};
       