import Leave from "../models/Leave.js"
import Employee from "../models/Employee.js"

// Request leave
const requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body
    const userId = req.user._id

    // Find the employee record for the current user
    const employee = await Employee.findOne({ userId })

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

    // Get leave history for the employee
    const leaveHistory = await Leave.find({ employeeId: employee._id }).sort({
      createdAt: -1,
    })

    return res.status(200).json({ success: true, leaveHistory })
  } catch (error) {
    console.error("Error fetching leave history:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching leave history" })
  }
}

// Get all leave requests (for admin)
const getAllLeaveRequests = async (req, res) => {
  try {
    // Get all leave requests with employee details
    const leaveRequests = await Leave.find()
      .populate({
        path: "employeeId",
        populate: {
          path: "userId",
          select: "name email profileImage",
        },
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

// Update leave status (approve/reject)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" })
    }

    const updatedLeave = await Leave.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true })

    if (!updatedLeave) {
      return res.status(404).json({ success: false, error: "Leave request not found" })
    }

    return res.status(200).json({
      success: true,
      message: `Leave request ${status}`,
      leave: updatedLeave,
    })
  } catch (error) {
    console.error("Error updating leave status:", error)
    return res.status(500).json({ success: false, error: "Server error in updating leave status" })
  }
}

export { requestLeave, getLeaveHistory, getAllLeaveRequests, updateLeaveStatus }

