import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"
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
  getDepartmentEmployees,
  getDepartmentEmployeeCount,
} from "../controllers/employeeController.js"

const router = express.Router()

router.get("/", authMiddleware, getEmployees)
// Specific routes first
router.get("/for-department-head", authMiddleware, getAllEmployeesForDepartmentHead)
router.get("/count", authMiddleware, getEmployeeCount)
router.get("/profile", authMiddleware, getEmployeeProfile)
router.get("/department-employees", authMiddleware, roleMiddleware(["department_head"]), getDepartmentEmployees)
router.get("/department-count", authMiddleware, roleMiddleware(["department_head"]), getDepartmentEmployeeCount)
router.post("/add", authMiddleware, upload.single("image"), addEmployee)
// Parameterized routes last
router.get("/:id", authMiddleware, getEmployee)
router.put("/:id", authMiddleware, updateEmployee)
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId)

export default router

