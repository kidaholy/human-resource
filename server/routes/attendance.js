import express from "express"
import verifyUser from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"
import {
  checkIn,
  checkOut,
  getEmployeeAttendance,
  getEmployeeAttendanceStats,
  getAllAttendance,
  getDepartmentAttendance,
  getDepartmentAttendanceStats,
  manageAttendance,
  updateAttendance,
  deleteAttendance,
  getTodayAttendance,
  bulkMarkAttendance,
  getDepartmentEmployeeCount,
} from "../controllers/attendanceController.js"

const router = express.Router()

// Employee routes
router.post("/check-in", verifyUser, checkIn)
router.post("/check-out", verifyUser, checkOut)
router.get("/employee/:employeeId", verifyUser, getEmployeeAttendance)
router.get("/employee/:employeeId/stats", verifyUser, getEmployeeAttendanceStats)
router.get("/employee/:employeeId/today", verifyUser, getTodayAttendance)

// Department head routes
router.get(
  "/department/:departmentId",
  verifyUser,
  roleMiddleware(["admin", "department_head"]),
  getDepartmentAttendance,
)
router.get(
  "/department/:departmentId/stats",
  verifyUser,
  roleMiddleware(["admin", "department_head"]),
  getDepartmentAttendanceStats,
)
router.get(
  "/department/:departmentId/employees/count",
  verifyUser,
  roleMiddleware(["admin", "department_head"]),
  getDepartmentEmployeeCount,
)
router.post("/bulk", verifyUser, roleMiddleware(["admin", "department_head"]), bulkMarkAttendance)

// Admin and department head routes
router.post("/manage", verifyUser, roleMiddleware(["admin", "department_head"]), manageAttendance)
router.put("/:id", verifyUser, roleMiddleware(["admin", "department_head"]), updateAttendance)

// Admin routes
router.get("/", verifyUser, roleMiddleware(["admin"]), getAllAttendance)
router.delete("/:id", verifyUser, roleMiddleware(["admin"]), deleteAttendance)

export default router
