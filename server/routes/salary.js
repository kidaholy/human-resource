import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  addSalary,
  getSalary,
  getLatestSalary,
  getMonthlyTotal,
  getEmployeeSalaryHistory,
  createMockSalary,
} from "../controllers/salaryController.js"

const router = express.Router()

// Important: Put more specific routes first to avoid conflicts
router.get("/employee/:employeeId", authMiddleware, getEmployeeSalaryHistory)
router.post("/mock/:userId", authMiddleware, createMockSalary)
router.get("/monthly-total", authMiddleware, getMonthlyTotal)
router.get("/:id/latest", authMiddleware, getLatestSalary)
router.get("/:id", authMiddleware, getSalary)
router.post("/add", authMiddleware, addSalary)

export default router
