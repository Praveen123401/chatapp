import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
  addMember,
  removeMember,
  renameGroup,
  getGroupMessages,
  sendGroupMessage,
} from "../controller/group.controller.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getMyGroups);
router.patch("/:id", protectRoute, renameGroup);
router.post("/:id/members", protectRoute, addMember);
router.delete("/:id/members", protectRoute, removeMember);
router.get("/:id/messages", protectRoute, getGroupMessages);
router.post("/:id/messages", protectRoute, sendGroupMessage);

export default router;
