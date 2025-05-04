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
  getEmployeeByUserId,
  getEmployeeBasicSalary,
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
// Add the new route for getting employee by user ID
router.get("/user/:userId", authMiddleware, getEmployeeByUserId)
// Parameterized routes last
router.get("/:id", authMiddleware, getEmployee)
router.put("/:id", authMiddleware, updateEmployee)
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId)
// Get employee's basic salary
router.get("/:id/basic-salary", authMiddleware, getEmployeeBasicSalary)

export default router
