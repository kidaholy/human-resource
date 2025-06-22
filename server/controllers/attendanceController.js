import Attendance from "../models/Attendance.js"
import Employee from "../models/Employee.js"

// Check in
export const checkIn = async (req, res) => {
  try {
    const { employeeId, notes, location } = req.body
    const userId = req.user.id

    // Get current date without time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if employee exists
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" })
    }

    // Check if attendance record already exists for today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (existingAttendance) {
      return res.status(400).json({ message: "Check-in already recorded for today" })
    }

    // Create new attendance record
    const attendance = new Attendance({
      employeeId,
      date: today,
      checkIn: new Date(),
      notes,
      location,
      createdBy: userId,
    })

    await attendance.save()
    res.status(201).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Check out
export const checkOut = async (req, res) => {
  try {
    const { employeeId, notes } = req.body

    // Get current date without time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find attendance record for today
    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (!attendance) {
      return res.status(404).json({ message: "No check-in record found for today" })
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Check-out already recorded for today" })
    }

    // Update attendance record with check-out time
    attendance.checkOut = new Date()
    attendance.notes = notes || attendance.notes
    attendance.calculateWorkHours()

    await attendance.save()
    res.status(200).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get attendance for a specific employee
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate } = req.query

    const query = { employeeId }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate("employeeId", "firstName lastName position")

    res.status(200).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get attendance statistics for a specific employee
export const getEmployeeAttendanceStats = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const stats = await Attendance.getEmployeeStats(employeeId, startDate, endDate)
    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all attendance records (admin only)
export const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, departmentId, status } = req.query
    const query = {}

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    // Add status filter if provided
    if (status) {
      query.status = status
    }

    let attendance

    if (departmentId) {
      // Get employees in the department
      const employees = await Employee.find({ departmentId })
      const employeeIds = employees.map((emp) => emp._id)

      // Add employee filter
      query.employeeId = { $in: employeeIds }
    }

    attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate({
        path: "employeeId",
        select: "firstName lastName position departmentId userId",
        populate: {
          path: "departmentId",
          select: "name",
        },
      })
      .populate("createdBy", "name")

    res.status(200).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get department attendance (for department head)
export const getDepartmentAttendance = async (req, res) => {
  try {
    const { departmentId } = req.params
    const { startDate, endDate, status } = req.query

    // Get employees in the department
    const employees = await Employee.find({ departmentId })
    const employeeIds = employees.map((emp) => emp._id)

    const query = {
      employeeId: { $in: employeeIds },
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    // Add status filter if provided
    if (status) {
      query.status = status
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate({
        path: "employeeId",
        select: "firstName lastName position userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })

    res.status(200).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get department attendance statistics
export const getDepartmentAttendanceStats = async (req, res) => {
  try {
    const { departmentId } = req.params
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" })
    }

    const stats = await Attendance.getDepartmentStats(departmentId, startDate, endDate)
    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create or update attendance record (admin or department head)
export const manageAttendance = async (req, res) => {
  try {
    const { employeeId, date, checkIn, checkOut, status, notes, isManualEntry, location } = req.body
    const userId = req.user.id

    // Format date to remove time component
    const formattedDate = new Date(date)
    formattedDate.setHours(0, 0, 0, 0)

    // Check if attendance record already exists for the date
    let attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: formattedDate,
        $lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (attendance) {
      // Update existing record
      attendance.checkIn = checkIn || attendance.checkIn
      attendance.checkOut = checkOut || attendance.checkOut
      attendance.status = status || attendance.status
      attendance.notes = notes || attendance.notes
      attendance.location = location || attendance.location
      attendance.isManualEntry = true
      attendance.createdBy = userId

      if (attendance.checkIn && attendance.checkOut) {
        attendance.calculateWorkHours()
      }
    } else {
      // Create new record
      attendance = new Attendance({
        employeeId,
        date: formattedDate,
        checkIn: checkIn || null,
        checkOut: checkOut || null,
        status: status || "present",
        notes: notes || "",
        location: location || "Office",
        isManualEntry: true,
        createdBy: userId,
      })

      if (attendance.checkIn && attendance.checkOut) {
        attendance.calculateWorkHours()
      }
    }

    await attendance.save()
    res.status(200).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update attendance record
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const { checkIn, checkOut, status, notes, location } = req.body
    const userId = req.user.id

    const attendance = await Attendance.findById(id)
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" })
    }

    // Update fields
    if (checkIn) attendance.checkIn = new Date(checkIn)
    if (checkOut) attendance.checkOut = new Date(checkOut)
    if (status) attendance.status = status
    if (notes) attendance.notes = notes
    if (location) attendance.location = location

    attendance.isManualEntry = true
    attendance.createdBy = userId

    if (attendance.checkIn && attendance.checkOut) {
      attendance.calculateWorkHours()
    }

    await attendance.save()
    res.status(200).json(attendance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete attendance record (admin only)
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params

    const attendance = await Attendance.findById(id)
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" })
    }

    await attendance.deleteOne()
    res.status(200).json({ message: "Attendance record deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get today's attendance status for an employee
export const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params

    // Get current date without time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (!attendance) {
      return res.status(200).json({ status: "not-checked-in" })
    }

    if (attendance.checkIn && !attendance.checkOut) {
      return res.status(200).json({ status: "checked-in", attendance })
    }

    if (attendance.checkIn && attendance.checkOut) {
      return res.status(200).json({ status: "checked-out", attendance })
    }

    res.status(200).json({ status: "unknown", attendance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Bulk mark attendance (for department head)
export const bulkMarkAttendance = async (req, res) => {
  try {
    const { employeeIds, date, status, notes, location } = req.body
    const userId = req.user.id
    const results = []

    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: "Employee IDs are required" })
    }

    // Format date to remove time component
    const formattedDate = new Date(date)
    formattedDate.setHours(0, 0, 0, 0)

    for (const employeeId of employeeIds) {
      try {
        // Check if attendance record already exists
        let attendance = await Attendance.findOne({
          employeeId,
          date: {
            $gte: formattedDate,
            $lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000),
          },
        })

        if (attendance) {
          // Update existing record
          attendance.status = status
          attendance.notes = notes || attendance.notes
          attendance.location = location || attendance.location
          attendance.isManualEntry = true
          attendance.createdBy = userId
        } else {
          // Create new record
          attendance = new Attendance({
            employeeId,
            date: formattedDate,
            status,
            notes: notes || "",
            location: location || "Office",
            isManualEntry: true,
            createdBy: userId,
          })
        }

        await attendance.save()
        results.push(attendance)
      } catch (error) {
        console.error(`Error processing attendance for employee ${employeeId}:`, error)
        // Continue with other employees even if one fails
      }
    }

    res.status(200).json({
      message: `Attendance marked for ${results.length} employees`,
      results,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get employee count in department
export const getDepartmentEmployeeCount = async (req, res) => {
  try {
    const { departmentId } = req.params

    const count = await Employee.countDocuments({ departmentId })
    res.status(200).json({ count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
