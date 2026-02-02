// import jwt from "jsonwebtoken";
// import User from "../model/user.model.js";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.cookies?.jwt;
//         console.log('protectRoute debug - cookies exist:', !!req.cookies, 'jwt present:', !!token);
//         console.log('protectRoute debug - JWT_SECRET set:', !!process.env.JWT_SECRET);
//         if (!token) {
//             return res
//                 .status(401)
//                 .json({ message: "Unauthorized - No token provided" });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('protectRoute debug - decoded token:', decoded && typeof decoded === 'object' ? { userId: decoded.userId } : decoded);
//         if (!decoded?.userId) {
//             return res.status(401).json({ message: "Unauthorized - Invalid token" });
//         }

//         const user = await User.findById(decoded.userId).select("-password");
//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.log("Error in protectRoute middleware:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };


import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
