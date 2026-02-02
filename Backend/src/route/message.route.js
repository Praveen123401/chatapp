// // 

import express from "express"; 
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	getUsersForSidebar,
	getMessages,
	sendMessage,
	editMessage,
	deleteMessage,
	toggleReaction,
} from "../controller/message.controller.js";
const router = express.Router(); 

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.patch("/:id", protectRoute, editMessage);
router.delete("/:id", protectRoute, deleteMessage);
router.post("/:id/reactions", protectRoute, toggleReaction);

export default router;


// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import {
//   getUsersForSidebar,
//   getMessages,
//   sendMessage
// } from "../controller/message.controller.js";

// const router = express.Router();

// router.get("/users", protectRoute, getUsersForSidebar);
// router.get("/:id", protectRoute, getMessages);
// router.post("/send/:id", protectRoute, sendMessage);

// export default router;
