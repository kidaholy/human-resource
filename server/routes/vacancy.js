import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addVacancy, getVacancies, getVacancy, updateVacancy, deleteVacancy } from "../controllers/vacancyController.js"

const router = express.Router()

router.post("/add", authMiddleware, addVacancy)
router.get("/", getVacancies)
router.get("/:id", getVacancy)
router.put("/:id", authMiddleware, updateVacancy)
router.delete("/:id", authMiddleware, deleteVacancy)

export default router

