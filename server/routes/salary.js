import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addSalary, getSalary, getLatestSalary, getMonthlyTotal } from "../controllers/salaryController.js"

const router = express.Router()
router.post("/add", authMiddleware, addSalary)
router.get("/:id", authMiddleware, getSalary)
router.get("/:id/latest", authMiddleware, getLatestSalary)
router.get("/monthly-total", authMiddleware, getMonthlyTotal)

export default router

