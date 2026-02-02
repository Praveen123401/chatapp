// import express, { Router } from "express"; 
// import { login, logout, signup, updateProfile, checkAuth } from "../controller/auth.controller.js";
// import { protectRoute } from "../middleware/auth.middleware.js";

// const router = express.Router(); 
// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout); 

// router.put("/update-profile",protectRoute,updateProfile); 
// router.get("/check",protectRoute,checkAuth); 
// router.get("/check", protectRoute, checkAuth);
    
// export  default router;


import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkauth
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// protected routes
router.put("/update-profile", protectRoute, updateProfile);

// Protect /check route so req.user is set
router.get("/check", protectRoute, checkauth);

export default router;


