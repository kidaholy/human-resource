import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addSalary, getSalary, getMonthlyTotal } from "../controllers/salaryController.js"

const router = express.Router()
router.post("/add", authMiddleware, addSalary)
router.get("/:id", authMiddleware, getSalary)
router.get("/monthly-total", authMiddleware, getMonthlyTotal)

export default router

