import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema(
  {
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobVacancy",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true },
)

const applicantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
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
    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        graduationYear: Number,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    skills: [String],
    applications: [applicationSchema],
  },
  { timestamps: true },
)

export default mongoose.model("Applicant", applicantSchema)

