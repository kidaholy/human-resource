import Department from "../models/Department.js"
import Employee from "../models/Employee.js"
import User from "../models/User.js"

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "departmentHead",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    return res.status(200).json({ success: true, departments })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get department server error" })
  }
}

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description, departmentHead } = req.body
    const newDep = new Department({
      dep_name,
      description,
      departmentHead: departmentHead || null,
    })
    await newDep.save()

    // If department head is assigned, update the user role
    if (departmentHead) {
      const employee = await Employee.findById(departmentHead)
      if (employee) {
        await User.findByIdAndUpdate(employee.userId, { role: "department_head" })
      }
    }

    return res.status(200).json({ success: true, department: newDep })
  } catch (error) {
    console.error("Error adding department:", error)
    return res.status(500).json({ success: false, error: "add department server error" })
  }
}

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const departments = await Department.findById({ _id: id }).populate({
      path: "departmentHead",
      populate: {
        path: "userId",
        select: "name email role",
      },
    })
    return res.status(200).json({ success: true, departments })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get department server error" })
  }
}

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const { dep_name, description, departmentHead } = req.body

    const department = await Department.findById(id)

    // If department head is being changed, update user roles
    if (
      department.departmentHead &&
      department.departmentHead.toString() !== departmentHead &&
      department.departmentHead !== null
    ) {
      // Remove department_head role from previous head
      const previousHead = await Employee.findById(department.departmentHead)
      if (previousHead) {
        await User.findByIdAndUpdate(previousHead.userId, { role: "employee" })
      }
    }

    // Assign new department head
    if (departmentHead) {
      const newHead = await Employee.findById(departmentHead)
      if (newHead) {
        await User.findByIdAndUpdate(newHead.userId, { role: "department_head" })
      }
    }

    const updateDep = await Department.findByIdAndUpdate(
      { _id: id },
      {
        dep_name,
        description,
        departmentHead: departmentHead || null,
        updateAt: Date.now(),
      },
      { new: true },
    )

    return res.status(200).json({ success: true, department: updateDep })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: "update department server error" })
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params

    // Get department to check if it has a department head
    const department = await Department.findById(id)

    if (department && department.departmentHead) {
      // Reset the department head's role to employee
      const head = await Employee.findById(department.departmentHead)
      if (head) {
        await User.findByIdAndUpdate(head.userId, { role: "employee" })
      }
    }

    const deleteDep = await Department.findByIdAndDelete(id)
    return res.status(200).json({ success: true, deleteDep })
  } catch (error) {
    return res.status(500).json({ success: false, error: "delete department server error" })
  }
}

// Get department count
const getDepartmentCount = async (req, res) => {
  try {
    const count = await Department.countDocuments()
    return res.status(200).json({ success: true, count })
  } catch (error) {
    console.error("Error getting department count:", error)
    return res.status(500).json({ success: false, error: "Server error in getting department count" })
  }
}

// Get eligible department heads
const getEligibleDepartmentHeads = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).populate("userId", "name email")
    return res.status(200).json({ success: true, employees })
  } catch (error) {
    console.error("Error getting eligible department heads:", error)
    return res.status(500).json({ success: false, error: "Server error in getting eligible department heads" })
  }
}

// Get department head
const getDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params
    const department = await Department.findById(id).populate({
      path: "departmentHead",
      populate: {
        path: "userId",
        select: "name email role",
      },
    })
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" })
    }
    return res.status(200).json({ success: true, departmentHead: department.departmentHead })
  } catch (error) {
    console.error("Error getting department head:", error)
    return res.status(500).json({ success: false, error: "Server error in getting department head" })
  }
}

// Export the functions
export {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentCount,
  getEligibleDepartmentHeads,
  getDepartmentHead,
}

