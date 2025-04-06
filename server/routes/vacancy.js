import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"
import {
  getVacancies,
  getVacancy,
  updateVacancy,
  deleteVacancy,
  requestVacancy,
  getVacancyRequests,
  processVacancyRequest,
  getPublicVacancies,
  getDepartmentHeadVacancies,
  addVacancy,
} from "../controllers/vacancyController.js"

const router = express.Router()

// Public routes (no auth required)
router.get("/public", getPublicVacancies)
router.get("/public/:id", getVacancy)

// Department head routes
router.post("/request", authMiddleware, roleMiddleware(["department_head"]), requestVacancy)
router.get("/my-requests", authMiddleware, roleMiddleware(["department_head"]), getDepartmentHeadVacancies)

// Admin routes
router.post("/add", authMiddleware, roleMiddleware(["admin"]), addVacancy) // New route for adding vacancies
router.get("/requests", authMiddleware, roleMiddleware(["admin"]), getVacancyRequests)
router.put("/requests/:id", authMiddleware, roleMiddleware(["admin"]), processVacancyRequest)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateVacancy)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteVacancy)

// Protected routes (admin and department head)
router.get("/", authMiddleware, getVacancies)
router.get("/:id", authMiddleware, getVacancy)

export default router

