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
  }
})

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    let userId = req.user?._id

    // If createAccount is true, create a new user
    if (req.body.createAccount && !userId) {
      const { fullName, email, phone, password } = req.body
      
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: "Email already registered. Please login instead." 
        })
      }
      
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({
        name: fullName,
        email,
        phone,
        password: hashedPassword,
        role: "applicant"
      })
      
      const savedUser = await newUser.save()
      userId = savedUser._id
      
      // Generate token for auto-login
      const token = jwt.sign(
        { _id: savedUser._id, role: savedUser.role }, 
        process.env.JWT_KEY, 
        { expiresIn: "10d" }
      )
      
      req.body.token = token
    }
    
    // If no userId (not logged in and not creating account), return error
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "You must be logged in or create an account to apply" 
      })
    }
    
    // Check if vacancy exists
    const vacancy = await JobVacancy.findById(req.body.vacancyId)
    if (!vacancy) {
      return res.status(404).json({ 
        success: false, 
        error: "Job vacancy not found" 
      })
    }
    
    // Check if user already applied for this vacancy
    const existingApplication = await Applicant.findOne({
      userId,
      vacancy: req.body.vacancyId
    })
    
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        error: "You have already applied for this position" 
      })
    }
    
    // Create new application
    const newApplication = new Applicant({
      userId,
      vacancy: req.body.vacancyId,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
      gender: req.body.gender,
      education: {
        degree: req.body.degree,
        institution: req.body.institution,
        graduationYear: req.body.graduationYear,
        cgpa: req.body.cgpa,
      },
      experience: req.body.experience,
      resume: req.file.filename,
      status: "pending",
    })
    
    await newApplication.save()
    
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      token: req.body.token,
    })
  } catch (error) {
    console.error("Error applying for job:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Server error in submitting application" 
    })
  }
}

// Get all applications (admin only)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Applicant.find()
      .populate("userId", "name email")
      .populate({
        path: "vacancy",
        populate: { path: "department", select: "dep_name" }
      })
      .sort({ createdAt: -1 })
    
    return res.status(200).json({
      success: true,
      applicants: applications
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching applications" 
    })
  }
}

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await Applicant.findById(req.params.id)
      .populate("userId", "name email")
      .populate({
        path: "vacancy",
        populate: { path: "department", select: "dep_name" }
      })
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      })
    }
    
    return res.status(200).json({
      success: true,
      applicant: application
    })
  } catch (error) {
    console.error("Error fetching application:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching application" 
    })
  }
}

// Get applications for a specific user
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id
    
    const applications = await Applicant.find({ userId })
      .populate({
        path: "vacancy",
        populate: { path: "department", select: "dep_name" }
      })
      .sort({ createdAt: -1 })
    
    return res.status(200).json({
      success: true,
      applications
    })
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching applications" 
    })
  }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, feedback } = req.body
    
    const application = await Applicant.findById(id)
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      })
    }
    
    // Update status and feedback
    application.status = status
    if (feedback) {
      application.feedback = feedback
    }
    application.updatedAt = Date.now()
    
    await application.save()
    
    // TODO: Send notification to applicant about status change
    
    return res.status(200).json({
      success: true,
      message: "Application status updated successfully"
    })
  } catch (error) {
    console.error("Error updating application status:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Server error in updating application status" 
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
        error: "Email already registered" 
      })
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "applicant"
    })
    
    const savedUser = await newUser.save()
    
    // Generate token
    const token = jwt.sign(
      { _id: savedUser._id, role: savedUser.role }, 
      process.env.JWT_KEY, 
      { expiresIn: "10d" }
    )
    
    return res.status(201).json({
      success: true,
      message: "Applicant registered successfully",
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        role: savedUser.role
      }
    })
  } catch (error) {
    console.error("Error registering applicant:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Server error in registering applicant" 
    })
  }
}

export {
  applyForJob,
  upload,
  getAllApplications,
  getApplicationById,
  getUserApplications,
  updateApplicationStatus,
  registerApplicant
}