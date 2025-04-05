import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"
import {
  requestLeave,
  getLeaveHistory,
  getDepartmentLeaveRequests,
  getAdminLeaveRequests,
  updateDepartmentHeadLeaveStatus,
  updateAdminLeaveStatus,
  getAllLeaveRequests,
  getLeaveStats,
  getDepartmentLeaveStats,
  getDepartmentEmployeesLeaveHistory
} from "../controllers/leaveController.js"

const router = express.Router()

// Employee routes
router.post("/request", authMiddleware, requestLeave)
router.get("/history", authMiddleware, getLeaveHistory)

// Department Head routes
router.get("/department-requests", authMiddleware, roleMiddleware(["department_head"]), getDepartmentLeaveRequests)
router.put("/department-head/:id", authMiddleware, roleMiddleware(["department_head"]), updateDepartmentHeadLeaveStatus)
router.get("/department-stats", authMiddleware, roleMiddleware(["department_head"]), getDepartmentLeaveStats)
router.get("/department-employees-history", authMiddleware, roleMiddleware(["department_head"]), getDepartmentEmployeesLeaveHistory)

// Admin routes
router.get("/admin-requests", authMiddleware, roleMiddleware(["admin"]), getAdminLeaveRequests)
router.put("/admin/:id", authMiddleware, roleMiddleware(["admin"]), updateAdminLeaveStatus)
router.get("/all", authMiddleware, roleMiddleware(["admin"]), getAllLeaveRequests)
router.get("/stats", authMiddleware, roleMiddleware(["admin"]), getLeaveStats)

// Export the router
export { router }

