import express from "express"
import {
  getAllApplications,
  getApplicationById,
  getUserApplications,
  applyForJob,
  updateApplicationStatus,
  registerApplicant,
  deleteApplication,
  updateApplication,
  upload,
} from "../controllers/applicantController.js"
import verifyUser from "../middleware/authMiddleware.js"

const router = express.Router()

// Apply for a job
router.post("/apply", upload.single("resume"), verifyUser, applyForJob)

// Register as an applicant
router.post("/register", registerApplicant)

// Get all applications (admin only)
router.get("/all", verifyUser, getAllApplications)

// Get user applications
router.get("/my-applications", verifyUser, getUserApplications)

// Get application by ID
router.get("/:id", verifyUser, getApplicationById)

// Update application status
router.put("/:id/status", verifyUser, updateApplicationStatus)

// Update application
router.put("/:id", verifyUser, updateApplication)

// Delete application
router.delete("/:id", verifyUser, deleteApplication)

export default router
