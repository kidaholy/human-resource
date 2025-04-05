import Leave from "../models/Leave.js"
import Employee from "../models/Employee.js"
import Department from "../models/Department.js"

// Request leave
const requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body
    const userId = req.user._id

    // Find the employee record for the current user
    const employee = await Employee.findOne({ userId }).populate("department")

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }

    // Create new leave request
    const newLeave = new Leave({
      employeeId: employee._id,
      startDate,
      endDate,
      leaveType,
      reason,
      departmentHeadStatus: "pending",
      adminStatus: "pending",
      status: "pending",
    })

    await newLeave.save()
    return res.status(201).json({ success: true, message: "Leave request submitted successfully" })
  } catch (error) {
    console.error("Error requesting leave:", error)
    return res.status(500).json({ success: false, error: "Server error in requesting leave" })
  }
}

// Get leave history for an employee
const getLeaveHistory = async (req, res) => {
  try {
    const userId = req.user._id

    // Find the employee record for the current user
    const employee = await Employee.findOne({ userId })

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }

    // Check if the employee is a department head
    const isDepartmentHead = await Department.findOne({ departmentHead: employee._id })

    // Get leave history for the employee
    const leaveHistory = await Leave.find({ employeeId: employee._id })
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "userId",
            select: "name email profileImage",
          },
          {
            path: "department",
            select: "dep_name",
          },
        ],
      })
      .sort({ createdAt: -1 })

    // Calculate total days for each leave request
    const leaveHistoryWithDays = leaveHistory.map(leave => {
      const startDate = new Date(leave.startDate)
      const endDate = new Date(leave.endDate)
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      return {
        ...leave.toObject(),
        totalDays,
        isDepartmentHead: !!isDepartmentHead
      }
    })

    return res.status(200).json({ 
      success: true, 
      leaveHistory: leaveHistoryWithDays,
      isDepartmentHead: !!isDepartmentHead 
    })
  } catch (error) {
    console.error("Error fetching leave history:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching leave history" })
  }
}

// Get all leave requests for department head
const getDepartmentLeaveRequests = async (req, res) => {
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
    const departmentEmployees = await Employee.find({
      department: department._id,
    }).select("_id")

    const employeeIds = departmentEmployees.map((emp) => emp._id)

    // Get all leave requests from employees in this department
    const leaveRequests = await Leave.find({
      employeeId: { $in: employeeIds },
      departmentHeadStatus: "pending", // Only show pending requests
    })
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "userId",
            select: "name email profileImage",
          },
          {
            path: "department",
          },
        ],
      })
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, leaveRequests })
  } catch (error) {
    console.error("Error fetching department leave requests:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching department leave requests",
    })
  }
}

// Get department leave statistics
const getDepartmentLeaveStats = async (req, res) => {
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
    const departmentEmployees = await Employee.find({
      department: department._id,
    }).select("_id")

    const employeeIds = departmentEmployees.map((emp) => emp._id)

    // Get leave statistics for this department
    const pending = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      departmentHeadStatus: "pending",
    })

    const approved = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      departmentHeadStatus: "approved",
    })

    const rejected = await Leave.countDocuments({
      employeeId: { $in: employeeIds },
      departmentHeadStatus: "rejected",
    })

    return res.status(200).json({
      success: true,
      pending,
      approved,
      rejected,
      total: pending + approved + rejected,
    })
  } catch (error) {
    console.error("Error fetching department leave stats:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching department leave stats",
    })
  }
}

// Get all department head approved leave requests (for admin)
const getAdminLeaveRequests = async (req, res) => {
  try {
    // Get all leave requests approved by department heads
    const leaveRequests = await Leave.find({
      departmentHeadStatus: "approved",
      adminStatus: "pending",
    })
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "userId",
            select: "name email profileImage",
          },
          {
            path: "department",
          },
        ],
      })
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, leaveRequests })
  } catch (error) {
    console.error("Error fetching admin leave requests:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching admin leave requests",
    })
  }
}

// Update department head leave status (approve/reject)
const updateDepartmentHeadLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, comment } = req.body
    const userId = req.user._id

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" })
    }

    // Verify the user is a department head
    const departmentHead = await Employee.findOne({ userId })
    if (!departmentHead) {
      return res.status(404).json({ success: false, error: "Department head not found" })
    }

    // Find the department where this employee is the head
    const department = await Department.findOne({ departmentHead: departmentHead._id })
    if (!department) {
      return res.status(403).json({ success: false, error: "You are not authorized to approve/reject leave requests" })
    }

    // Find the leave request
    const leave = await Leave.findById(id).populate("employeeId")
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave request not found" })
    }

    // Verify the leave request belongs to an employee in the department head's department
    const employee = await Employee.findById(leave.employeeId)
    if (!employee || employee.department.toString() !== department._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only approve/reject leave requests for employees in your department",
      })
    }

    // Update the leave request
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      {
        departmentHeadStatus: status,
        departmentHeadComment: comment || "",
        updatedAt: Date.now(),
      },
      { new: true },
    )

    // If department head rejects, automatically update the overall status
    if (status === "rejected") {
      updatedLeave.status = "rejected"
      await updatedLeave.save()
    }

    return res.status(200).json({
      success: true,
      message: `Leave request ${status} by department head`,
      leave: updatedLeave,
    })
  } catch (error) {
    console.error("Error updating department head leave status:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in updating department head leave status",
    })
  }
}

// Update admin leave status (approve/reject)
const updateAdminLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, comment } = req.body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" })
    }

    const leave = await Leave.findById(id)

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave request not found" })
    }

    // Check if department head has approved
    if (leave.departmentHeadStatus !== "approved") {
      return res.status(400).json({
        success: false,
        error: "Department head must approve before admin can process",
      })
    }

    // Update admin status
    leave.adminStatus = status
    leave.adminComment = comment || ""
    leave.updatedAt = Date.now()

    // Update overall status
    leave.status = status

    await leave.save()

    return res.status(200).json({
      success: true,
      message: `Leave request ${status} by admin`,
      leave,
    })
  } catch (error) {
    console.error("Error updating admin leave status:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in updating admin leave status",
    })
  }
}

// Get all leave requests (for admin dashboard)
const getAllLeaveRequests = async (req, res) => {
  try {
    // Get all leave requests with employee details
    const leaveRequests = await Leave.find()
      .populate({
        path: "employeeId",
        populate: [
          {
            path: "userId",
            select: "name email profileImage",
          },
          {
            path: "department",
          },
        ],
      })
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, leaveRequests })
  } catch (error) {
    console.error("Error fetching all leave requests:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching all leave requests",
    })
  }
}

// Get leave statistics
const getLeaveStats = async (req, res) => {
  try {
    // Count total leaves
    const total = await Leave.countDocuments()

    // Count approved leaves
    const approved = await Leave.countDocuments({ status: "approved" })

    // Count pending leaves
    const pending = await Leave.countDocuments({ status: "pending" })

    // Count rejected leaves
    const rejected = await Leave.countDocuments({ status: "rejected" })

    // Count department head pending approvals
    const departmentHeadPending = await Leave.countDocuments({
      departmentHeadStatus: "pending",
      status: "pending",
    })

    // Count admin pending approvals (that are already approved by department head)
    const adminPending = await Leave.countDocuments({
      departmentHeadStatus: "approved",
      adminStatus: "pending",
    })

    return res.status(200).json({
      success: true,
      total,
      approved,
      pending,
      rejected,
      departmentHeadPending,
      adminPending,
    })
  } catch (error) {
    console.error("Error getting leave statistics:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in getting leave statistics",
    })
  }
}

// Get department employees' leave history
const getDepartmentEmployeesLeaveHistory = async (req, res) => {
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
    const departmentEmployees = await Employee.find({
      department: department._id,
    }).select("_id")

    const employeeIds = departmentEmployees.map((emp) => emp._id)

    // Get leave history for all employees in the department
    const leaveHistory = await Leave.find({
      employeeId: { $in: employeeIds }
    })
    .populate({
      path: "employeeId",
      populate: [
        {
          path: "userId",
          select: "name email profileImage",
        },
        {
          path: "department",
          select: "dep_name",
        },
      ],
    })
    .sort({ createdAt: -1 })

    // Calculate total days for each leave request
    const leaveHistoryWithDays = leaveHistory.map(leave => {
      const startDate = new Date(leave.startDate)
      const endDate = new Date(leave.endDate)
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      return {
        ...leave.toObject(),
        totalDays
      }
    })

    return res.status(200).json({ 
      success: true, 
      leaveHistory: leaveHistoryWithDays,
      departmentName: department.dep_name
    })
  } catch (error) {
    console.error("Error fetching department employees leave history:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching department employees leave history" })
  }
}

export {
  requestLeave,
  getLeaveHistory,
  getDepartmentLeaveRequests,
  getDepartmentLeaveStats,
  getAdminLeaveRequests,
  updateDepartmentHeadLeaveStatus,
  updateAdminLeaveStatus,
  getAllLeaveRequests,
  getLeaveStats,
  getDepartmentEmployeesLeaveHistory
}

