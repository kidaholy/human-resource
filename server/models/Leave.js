import mongoose from "mongoose"
import { Schema } from "mongoose"

const leaveSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ["annual", "sick", "maternity", "paternity", "bereavement", "other"],
  },
  reason: {
    type: String,
    required: true,
  },
  departmentHeadStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  departmentHeadComment: {
    type: String,
    default: "",
  },
  adminStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminComment: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  medicalCertificate: {
    type: Boolean,
    default: false,
  },
  willProvideDocumentationLater: {
    type: Boolean,
    default: false,
  },
  medicalDocumentation: {
    type: String,
    default: null,
  },
  documentationProvided: {
    type: Boolean,
    default: false,
  },
  documentationVerified: {
    type: Boolean,
    default: false,
  },
})

// Virtual property to calculate total days
leaveSchema.virtual("totalDays").get(function () {
  const start = new Date(this.startDate)
  const end = new Date(this.endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days
  return diffDays
})

// Middleware to update status based on department head and admin status
leaveSchema.pre("save", function (next) {
  if (this.departmentHeadStatus === "rejected") {
    this.status = "rejected"
  } else if (this.adminStatus === "approved" && this.departmentHeadStatus === "approved") {
    this.status = "approved"
  } else if (this.adminStatus === "rejected") {
    this.status = "rejected"
  }
  next()
})

// Ensure virtuals are included when converting to JSON
leaveSchema.set("toJSON", { virtuals: true })
leaveSchema.set("toObject", { virtuals: true })

const Leave = mongoose.model("Leave", leaveSchema)
export default Leave
