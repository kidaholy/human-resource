import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  requestLeave,
  getLeaveHistory,
  getAllLeaveRequests,
  updateLeaveStatus,
  getLeaveStats,
} from "../controllers/leaveController.js"

const router = express.Router()

// Employee routes
router.post("/request", authMiddleware, requestLeave)
router.get("/history", authMiddleware, getLeaveHistory)

// Admin routes
router.get("/all", authMiddleware, getAllLeaveRequests)
router.put("/:id/status", authMiddleware, updateLeaveStatus)
router.get("/stats", authMiddleware, getLeaveStats)

export default router

