import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import CallHistory from "../model/callHistory.model.js";

const router = express.Router();

// Get call history
router.get("/", protectRoute, async (req, res) => {
  try {
    const callHistory = await CallHistory.find({
      $or: [
        { callerId: req.user._id },
        { receiverId: req.user._id },
      ],
    })
      .populate("callerId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(callHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get call history with specific user
router.get("/:userId", protectRoute, async (req, res) => {
  try {
    const callHistory = await CallHistory.find({
      $or: [
        { callerId: req.user._id, receiverId: req.params.userId },
        { callerId: req.params.userId, receiverId: req.user._id },
      ],
    })
      .populate("callerId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.json(callHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start a call
router.post("/start", protectRoute, async (req, res) => {
  try {
    const { receiverId, callType } = req.body;

    const callHistory = new CallHistory({
      callerId: req.user._id,
      receiverId,
      callType,
      status: "missed",
    });

    await callHistory.save();

    res.json({
      message: "Call initiated",
      callHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// End a call
router.put("/:callId/end", protectRoute, async (req, res) => {
  try {
    const { status } = req.body;

    const call = await CallHistory.findByIdAndUpdate(
      req.params.callId,
      {
        endedAt: new Date(),
        status: status || "completed",
        duration: Math.floor(
          (new Date() - new Date(req.body.startTime)) / 1000
        ),
      },
      { new: true }
    );

    res.json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
