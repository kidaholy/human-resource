// server/controllers/applicantController.js
import Applicant from "../models/Applicant.js"
import User from "../models/User.js"
import JobVacancy from "../models/JobVacancy.js"
import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import jwt from "jsonwebtoken"

// Configure storage for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/resumes")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"))
    }
  },
})

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    console.log("Apply for job request received")
    console.log("Auth user:", req.user ? { id: req.user._id, role: req.user.role } : "No user")
    console.log("Form data:", {
      vacancyId: req.body.vacancyId,
      fullName: req.body.fullName,
      email: req.body.email,
      createAccount: req.body.createAccount,
    })

    // Get user ID from authenticated user
    let userId = req.user?._id

    // If user is authenticated, log the details
    if (userId) {
      console.log(`User is authenticated with ID: ${userId}`)
    } else {
      console.log("User is not authenticated")
    }

    // If createAccount is true, create a new user
    if (req.body.createAccount === "true" && !userId) {
      const { fullName, email, phone, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already registered. Please login instead.",
        })
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({
        name: fullName,
        email,
        phone,
        password: hashedPassword,
        role: "applicant",
      })

      const savedUser = await newUser.save()
      userId = savedUser._id

      // Generate token for auto-login
      const token = jwt.sign({ _id: savedUser._id, role: savedUser.role }, process.env.JWT_KEY, { expiresIn: "10d" })

      req.body.token = token
      console.log("Created new user with ID:", userId)
    }

    // If no userId (not logged in and not creating account), return error
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "You must be logged in or create an account to apply",
      })
    }

    // Check if vacancy exists
    const vacancy = await JobVacancy.findById(req.body.vacancyId)
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        error: "Job vacancy not found",
      })
    }

    // Check if applicant already exists
    let applicant = await Applicant.findOne({ user: userId })

    if (!applicant) {
      // Create new applicant if doesn't exist
      applicant = new Applicant({
        user: userId,
        name: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        education: [],
        experience: [],
        skills: [],
        applications: [],
      })
    }

    // Check if user already applied for this vacancy
    const alreadyApplied = applicant.applications.some(
      (app) => app.vacancy && app.vacancy.toString() === req.body.vacancyId,
    )

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        error: "You have already applied for this position",
      })
    }

    // Create education object if provided
    const education = req.body.degree
      ? {
          degree: req.body.degree,
          institution: req.body.institution,
          fieldOfStudy: req.body.fieldOfStudy,
          graduationYear: req.body.graduationYear,
        }
      : null

    if (education && !applicant.education.some((e) => e.degree === education.degree)) {
      applicant.education.push(education)
    }

    // Add experience if provided
    if (req.body.experience) {
      // Check if experience is a string (from textarea) or already an array of objects
      if (typeof req.body.experience === "string") {
        // If it's a string from the textarea, create a single experience entry
        const experienceText = req.body.experience.trim()
        if (experienceText) {
          // Only add if there's actual content
          const newExperience = {
            title: "Experience",
            company: "From Application",
            description: experienceText,
            startDate: new Date(),
            endDate: new Date(),
          }

          // Add to experience array if not already present
          if (!applicant.experience.some((e) => e.description === experienceText)) {
            applicant.experience.push(newExperience)
          }
        }
      } else {
        // Handle case where experience might be an array of objects (from API)
        const newExperience = Array.isArray(req.body.experience) ? req.body.experience : [req.body.experience]

        // Add only new experiences
        for (const exp of newExperience) {
          if (!applicant.experience.some((e) => e.company === exp.company && e.title === exp.title)) {
            applicant.experience.push(exp)
          }
        }
      }
    }

    // Add new application
    applicant.applications.push({
      vacancy: req.body.vacancyId,
      status: "pending",
      resume: req.file.filename,
      coverLetter: req.body.coverLetter,
      applicationDate: new Date(),
    })

    await applicant.save()
    console.log("Application saved successfully")

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      token: req.body.token,
    })
  } catch (error) {
    console.error("Error applying for job:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in submitting application",
    })
  }
}

// Get all applications (admin only)
const getAllApplications = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access. Admin privileges required.",
      })
    }

    const applicants = await Applicant.find()
      .populate("user", "name email phone")
      .populate({
        path: "applications.vacancy",
        populate: { path: "department", select: "dep_name" },
      })
      .sort({ createdAt: -1 })

    // Format the response to match what the frontend expects
    const formattedApplications = applicants.flatMap((applicant) =>
      applicant.applications.map((app) => ({
        _id: app._id,
        applicantId: applicant._id,
        fullName: applicant.name,
        email: applicant.email,
        phone: applicant.phone,
        status: app.status,
        applicationDate: app.applicationDate,
        resume: app.resume,
        feedback: app.feedback,
        vacancy: app.vacancy,
        education: applicant.education,
        experience: applicant.experience,
        user: {
          _id: applicant.user?._id,
          name: applicant.user?.name,
        },
      }))
    )

    return res.status(200).json({
      success: true,
      applications: formattedApplications,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to fetch applications. Please try again later.",
    })
  }
}

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id
    console.log("Fetching application with ID:", applicationId)

    // Find the applicant that contains the application with the given ID
    const applicant = await Applicant.findOne({ "applications._id": applicationId })
      .populate("user", "name email")
      .populate({
        path: "applications.vacancy",
        populate: { path: "department", select: "dep_name" },
      })

    if (!applicant) {
      console.error("Application not found with ID:", applicationId)
      return res.status(404).json({
        success: false,
        error: "Application not found",
      })
    }

    console.log("Found applicant:", {
      _id: applicant._id,
      name: applicant.name,
      email: applicant.email,
      applications: applicant.applications.map((app) => ({ _id: app._id, status: app.status })),
    })

    // Find the specific application
    const application = applicant.applications.find((app) => app._id.toString() === applicationId)

    if (!application) {
      console.error("Application not found in applicant's applications")
      return res.status(404).json({
        success: false,
        error: "Application not found",
      })
    }

    // Format the response
    const formattedApplication = {
      _id: application._id,
      applicantId: applicant._id,
      name: applicant.name || "Unknown",
      fullName: applicant.name || "Unknown",
      email: applicant.email || "No email provided",
      phone: applicant.phone || "No phone provided",
      dob: applicant.dob || null,
      gender: applicant.gender || "",
      status: application.status || "pending",
      applicationDate: application.applicationDate || application.createdAt || new Date(),
      resume: application.resume || "",
      feedback: application.feedback || "",
      vacancy: application.vacancy || {},
      education:
        applicant.education && applicant.education.length > 0
          ? applicant.education[0]
          : {
              degree: "",
              institution: "",
              graduationYear: "",
              cgpa: "",
            },
      experience: applicant.experience || "",
      user: {
        _id: applicant.user?._id || "",
        name: applicant.user?.name || applicant.name || "Unknown",
      },
    }

    console.log("Formatted application:", formattedApplication)

    return res.status(200).json({
      success: true,
      applicant: formattedApplication,
    })
  } catch (error) {
    console.error("Error fetching application:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching application",
    })
  }
}

// Get applications for a specific user
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id

    const applicant = await Applicant.findOne({ user: userId }).populate({
      path: "applications.vacancy",
      populate: { path: "department", select: "dep_name" },
    })

    if (!applicant) {
      return res.status(200).json({
        success: true,
        applications: [],
      })
    }

    // Format the response
    const formattedApplications = applicant.applications.map((app) => ({
      _id: app._id,
      applicantId: applicant._id,
      name: applicant.name || "Unknown",
      fullName: applicant.name || "Unknown",
      email: applicant.email || "No email provided",
      phone: applicant.phone || "No phone provided",
      status: app.status || "pending",
      applicationDate: app.applicationDate || app.createdAt || new Date(),
      resume: app.resume,
      feedback: app.feedback || "",
      vacancy: app.vacancy || {},
      education:
        applicant.education.length > 0
          ? applicant.education[0]
          : {
              degree: "N/A",
              institution: "N/A",
              fieldOfStudy: "N/A",
              graduationYear: "N/A",
            },
      experience: applicant.experience.length > 0 ? applicant.experience[0] : null,
      user: {
        _id: applicant.user || userId,
        name: applicant.name || "Unknown",
      },
    }))

    return res.status(200).json({
      success: true,
      applications: formattedApplications,
    })
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in fetching applications",
    })
  }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, feedback } = req.body

    // Find the applicant containing the application with the given ID
    const applicant = await Applicant.findOne({ "applications._id": id })

    if (!applicant) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      })
    }

    // Find and update the specific application
    const applicationIndex = applicant.applications.findIndex((app) => app._id.toString() === id)

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      })
    }

    // Update status and feedback
    applicant.applications[applicationIndex].status = status

    if (feedback) {
      applicant.applications[applicationIndex].feedback = feedback
    }

    await applicant.save()

    // TODO: Send notification to applicant about status change

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in updating application status",
    })
  }
}

// Register applicant
const registerApplicant = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      })
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "applicant",
    })

    const savedUser = await newUser.save()

    // Generate token
    const token = jwt.sign({ _id: savedUser._id, role: savedUser.role }, process.env.JWT_KEY, { expiresIn: "10d" })

    return res.status(201).json({
      success: true,
      message: "Applicant registered successfully",
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        role: savedUser.role,
      },
    })
  } catch (error) {
    console.error("Error registering applicant:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in registering applicant",
    })
  }
}

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params

    // Find the applicant containing the application with the given ID
    const applicant = await Applicant.findOne({ "applications._id": id })

    if (!applicant) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      })
    }

    // Remove the application from the applications array
    applicant.applications = applicant.applications.filter((app) => app._id.toString() !== id)

    await applicant.save()

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting application:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in deleting application",
    })
  }
}

const updateApplication = async (req, res) => {
  try {
    console.log("Update Application Request:", req.params, req.body)

    const { id } = req.params
    const { fullName, email, phone, dob, gender, education, experience, status } = req.body

    // Find the applicant containing the application with this ID
    const applicant = await Applicant.findOne({ "applications._id": id })

    if (!applicant) {
      console.error("Application not found with ID:", id)
      return res.status(404).json({ success: false, message: "Application not found" })
    }

    // Find the application index
    const applicationIndex = applicant.applications.findIndex((app) => app._id.toString() === id)

    if (applicationIndex === -1) {
      console.error("Application not found in applicant:", applicant)
      return res.status(404).json({ success: false, message: "Application not found" })
    }

    // Update base applicant data
    applicant.name = fullName
    applicant.email = email
    applicant.phone = phone

    // Update application status
    applicant.applications[applicationIndex].status = status

    // Handle education - ensure it exists
    if (!applicant.education || !Array.isArray(applicant.education) || applicant.education.length === 0) {
      applicant.education = [{}]
    }

    // Update education fields
    applicant.education[0] = {
      ...applicant.education[0],
      degree: education.degree || "",
      institution: education.institution || "",
      graduationYear: education.graduationYear || "",
      cgpa: education.cgpa || "",
    }

    // Update other fields if provided
    if (dob) applicant.dob = dob
    if (gender) applicant.gender = gender
    if (experience) applicant.experience = experience || ""

    // Save the updated applicant
    await applicant.save()

    // Build response object in the format the frontend expects
    const updatedApplication = {
      _id: applicant.applications[applicationIndex]._id,
      applicantId: applicant._id,
      fullName: applicant.name,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      dob: applicant.dob,
      gender: applicant.gender,
      status: applicant.applications[applicationIndex].status,
      education: applicant.education[0] || {},
      experience: applicant.experience || "",
      resume: applicant.applications[applicationIndex].resume || "",
      feedback: applicant.applications[applicationIndex].feedback || "",
      applicationDate: applicant.applications[applicationIndex].applicationDate || new Date(),
      vacancy: applicant.applications[applicationIndex].vacancy || {},
    }

    console.log("Updated Application:", updatedApplication)

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      applicant: updatedApplication,
    })
  } catch (error) {
    console.error("Error updating application:", error)
    res.status(500).json({ success: false, message: error.message || "Server error" })
  }
}

// Export all controller functions
export {
  applyForJob,
  upload,
  getAllApplications,
  getApplicationById,
  getUserApplications,
  updateApplicationStatus,
  registerApplicant,
  deleteApplication,
  updateApplication,
}
