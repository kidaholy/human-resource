import mongoose from "mongoose"
import { Schema } from "mongoose"

const jobVacancySchema = new Schema({
  position: {
    type: String,
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  salary: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  eduLevel: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "any"],
    default: "any",
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 4.0,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed", "draft"],
    default: "active",
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

const JobVacancy = mongoose.model("JobVacancy", jobVacancySchema)
export default JobVacancy

