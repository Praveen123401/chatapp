import User from "../model/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const upload = await cloudinary.uploader.upload(req.file.path, {
    folder: "profile_pics"
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilepic: upload.secure_url },
    { new: true }
  ).select("-password");

  res.json(user);
};
