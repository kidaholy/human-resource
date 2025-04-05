import mongoose from "mongoose"
import { Schema } from "mongoose"

const applicantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vacancy: {
    type: Schema.Types.ObjectId,
    ref: "JobVacancy",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  education: {
    degree: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
    },
  },
  experience: {
    type: String,
  },
  resume: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shortlisted", "interviewed", "selected", "rejected"],
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
})

const Applicant = mongoose.model("Applicant", applicantSchema)
export default Applicant

