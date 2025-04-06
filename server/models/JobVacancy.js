import mongoose from "mongoose";

const JobVacancySchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
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
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "draft",
    },
    // New fields for request workflow
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    justification: {
      type: String,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobVacancy", JobVacancySchema);
