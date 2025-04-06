// server/routes/applicant.js
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"
import {
  applyForJob,
  upload,
  getAllApplications,
  getApplicationById,
  getUserApplications,
  updateApplicationStatus,
  registerApplicant
} from "../controllers/applicantController.js"

const router = express.Router()

// Public routes
router.post("/register-applicant", registerApplicant)
router.post("/apply", upload.single("resume"), applyForJob)

// Protected routes
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllApplications)
router.get("/my-applications", authMiddleware, getUserApplications)
router.get("/:id", authMiddleware, getApplicationById)
router.put("/:id/status", authMiddleware, roleMiddleware(["admin"]), updateApplicationStatus)

export default router