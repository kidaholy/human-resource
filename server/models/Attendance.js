import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkIn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day", "on-leave"],
      default: "present",
    },
    workHours: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Office",
    },
    isManualEntry: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

// Create compound index for employee and date to prevent duplicate entries
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

// Method to calculate work hours when checking out
attendanceSchema.methods.calculateWorkHours = function () {
  if (this.checkIn && this.checkOut) {
    const checkInTime = new Date(this.checkIn).getTime()
    const checkOutTime = new Date(this.checkOut).getTime()
    const diffMs = checkOutTime - checkInTime
    const diffHrs = diffMs / (1000 * 60 * 60)
    this.workHours = Number.parseFloat(diffHrs.toFixed(2))
  }
  return this.workHours
}

// Static method to get attendance statistics for a specific employee
attendanceSchema.statics.getEmployeeStats = async function (employeeId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        employeeId: new mongoose.Types.ObjectId(employeeId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalHours: { $sum: "$workHours" },
      },
    },
  ])

  return stats
}

// Static method to get department attendance statistics
attendanceSchema.statics.getDepartmentStats = async function (departmentId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $match: {
        "employee.departmentId": new mongoose.Types.ObjectId(departmentId),
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalHours: { $sum: "$workHours" },
      },
    },
  ])

  return stats
}

const Attendance = mongoose.model("Attendance", attendanceSchema)

export default Attendance
