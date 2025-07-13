import multer from "multer"
import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import path from "path"
import Department from "../models/Department.js"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
      phone,
      address,
      emergencyContact,
    } = req.body

    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ success: false, error: "user already registered in emp" })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    })

    const savedUser = await newUser.save()

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      phone,
      address,
      emergencyContact,
    })

    await newEmployee.save()
    return res.status(200).json({ success: true, message: "employee created" })
  } catch (error) {
    console.error("Error adding employee:", error)
    return res.status(500).json({ success: false, error: "server error in adding employee" })
  }
}

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("userId", { password: 0 }).populate("department")
    return res.status(200).json({ success: true, employees })
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in getting employees" })
  }
}

const getEmployee = async (req, res) => {
  const { id } = req.params
  try {
    const employee = await Employee.findById({ _id: id }).populate("userId", { password: 0 }).populate("department")
    return res.status(200).json({ success: true, employee })
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in getting employee" })
  }
}

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { name, maritalStatus, designation, department, salary, phone, address, emergencyContact } = req.body

    const employee = await Employee.findById({ _id: id })
    if (!employee) {
      return res.status(404).json({ success: false, error: "employee not found" })
    }

    const user = await User.findById({ _id: employee.userId })

    if (!user) {
      return res.status(404).json({ success: false, error: "user not found" })
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: employee.userId },
      {
        name,
      },
    )
    const updateEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        designation,
        maritalStatus,
        salary,
        department,
        phone,
        address,
        emergencyContact,
      },
      { new: true },
    )

    if (!updateEmployee || !updateUser) {
      return res.status(500).json({ success: false, error: "server error in updating employee" })
    }

    return res.status(200).json({ success: true, message: "employee updated" })
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in updating employee" })
  }
}

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params
  try {
    const employees = await Employee.find({ department: id })
      .populate("userId", "name email profileImage")
      .populate("department", "dep_name")

    return res.status(200).json({ success: true, employees })
  } catch (error) {
    return res.status(500).json({ success: false, error: "server error in getting employeesByDepId" })
  }
}

// Get employee count
const getEmployeeCount = async (req, res) => {
  try {
    const count = await Employee.countDocuments()
    return res.status(200).json({ success: true, count })
  } catch (error) {
    console.error("Error getting employee count:", error)
    return res.status(500).json({ success: false, error: "Server error in getting employee count" })
  }
}

// Get employee profile for current user
const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user._id

    const employee = await Employee.findOne({ userId }).populate("userId", { password: 0 }).populate("department")

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee profile not found" })
    }

    return res.status(200).json({ success: true, employee })
  } catch (error) {
    console.error("Error fetching employee profile:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching employee profile" })
  }
}

// Add this function to the existing employeeController.js file

// Get all employees for department head selection
const getAllEmployeesForDepartmentHead = async (req, res) => {
  try {
    // Get all employees with their user and department information
    const employees = await Employee.find().populate("userId", "name email role").populate("department", "dep_name")

    if (!employees) {
      return res.status(404).json({
        success: false,
        error: "No employees found",
      })
    }

    return res.status(200).json({
      success: true,
      employees,
    })
  } catch (error) {
    console.error("Error getting employees for department head selection:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in getting employees for department head selection",
    })
  }
}

// Add this function to fetch employees by department for the department head
const getDepartmentEmployees = async (req, res) => {
  try {
    const userId = req.user._id

    // Find the employee record for the current user (department head)
    const departmentHead = await Employee.findOne({ userId })

    if (!departmentHead) {
      return res.status(404).json({ success: false, error: "Department head not found" })
    }

    // Find the department where this employee is the head
    const department = await Department.findOne({ departmentHead: departmentHead._id })

    if (!department) {
      return res.status(404).json({ success: false, error: "You are not assigned as a department head" })
    }

    // Find all employees in this department
    const employees = await Employee.find({ department: department._id })
      .populate("userId", "name email profileImage role")
      .populate("department", "dep_name")

    return res.status(200).json({
      success: true,
      employees,
      departmentName: department.dep_name,
    })
  } catch (error) {
    console.error("Error fetching department employees:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching department employees",
    })
  }
}

// Add this function to get department employee count
const getDepartmentEmployeeCount = async (req, res) => {
  try {
    const userId = req.user._id

    // Find the employee record for the current user (department head)
    const departmentHead = await Employee.findOne({ userId })

    if (!departmentHead) {
      return res.status(404).json({ success: false, error: "Department head not found" })
    }

    // Find the department where this employee is the head
    const department = await Department.findOne({ departmentHead: departmentHead._id })

    if (!department) {
      return res.status(404).json({ success: false, error: "You are not assigned as a department head" })
    }

    // Count employees in this department
    const count = await Employee.countDocuments({ department: department._id })

    return res.status(200).json({ success: true, count })
  } catch (error) {
    console.error("Error getting department employee count:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in getting department employee count",
    })
  }
}

// Get employee by user ID
const getEmployeeByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const employee = await Employee.findOne({ userId }).populate("userId", { password: 0 }).populate("department")

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }

    return res.status(200).json({ success: true, employee })
  } catch (error) {
    console.error("Error getting employee by user ID:", error)
    return res.status(500).json({ success: false, error: "Server error in getting employee" })
  }
}

// Get employee's basic salary
const getEmployeeBasicSalary = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.findById(id).select("salary")

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }

    return res.status(200).json({
      success: true,
      basicSalary: employee.salary,
    })
  } catch (error) {
    console.error("Error getting employee basic salary:", error)
    return res.status(500).json({ success: false, error: "Server error in getting employee basic salary" })
  }
}

// Make sure to export this new function along with the existing ones
export {
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
}
