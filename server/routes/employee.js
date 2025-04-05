import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  getEmployeeCount,
  getEmployeeProfile,
  getAllEmployeesForDepartmentHead,
} from "../controllers/employeeController.js"

const router = express.Router()

router.get("/", authMiddleware, getEmployees)
// Move the specific routes before the parameterized routes
router.get("/for-department-head", authMiddleware, getAllEmployeesForDepartmentHead)
router.get("/count", authMiddleware, getEmployeeCount)
router.get("/profile", authMiddleware, getEmployeeProfile)
router.post("/add", authMiddleware, upload.single("image"), addEmployee)
// Parameterized routes should come after specific routes
router.get("/:id", authMiddleware, getEmployee)
router.put("/:id", authMiddleware, updateEmployee)
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId)

export default router

