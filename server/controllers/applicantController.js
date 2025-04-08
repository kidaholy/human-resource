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
    
    // Check if applicant already exists
    let applicant = await Applicant.findOne({ user: userId });
    
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
        applications: []
      });
    }
    
    // Check if user already applied for this vacancy
    const alreadyApplied = applicant.applications.some(app => 
      app.vacancy.toString() === req.body.vacancyId
    );
    
    if (alreadyApplied) {
      return res.status(400).json({ 
        success: false, 
        error: "You have already applied for this position" 
      });
    }
    
    // Create education object if provided
    const education = req.body.degree ? {
      degree: req.body.degree,
      institution: req.body.institution,
      fieldOfStudy: req.body.fieldOfStudy,
      graduationYear: req.body.graduationYear
    } : null;
    
    if (education && !applicant.education.some(e => e.degree === education.degree)) {
      applicant.education.push(education);
    }
    
    // Add experience if provided
    if (req.body.experience) {
      const newExperience = Array.isArray(req.body.experience) 
        ? req.body.experience 
        : [req.body.experience];
        
      // Add only new experiences
      for (const exp of newExperience) {
        if (!applicant.experience.some(e => e.company === exp.company && e.title === exp.title)) {
          applicant.experience.push(exp);
        }
      }
    }
    
    // Add new application
    applicant.applications.push({
      vacancy: req.body.vacancyId,
      status: "pending",
      resume: req.file.filename,
      coverLetter: req.body.coverLetter,
      applicationDate: new Date()
    });
    
    await applicant.save();
    
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
    const applicants = await Applicant.find()
      .populate("user", "name email")
      .populate({
        path: "applications.vacancy",
        populate: { path: "department", select: "dep_name" }
      })
      .sort({ createdAt: -1 });
    
    // Format the response to match what the frontend expects
    const formattedApplications = applicants.flatMap(applicant => 
      applicant.applications.map(app => ({
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
        education: applicant.education.length > 0 ? applicant.education[0] : {
          degree: "N/A",
          institution: "N/A",
          fieldOfStudy: "N/A",
          graduationYear: "N/A"
        },
        experience: applicant.experience.length > 0 ? applicant.experience[0] : null,
        user: {
          _id: applicant.user?._id,
          name: applicant.user?.name || applicant.name || "Unknown"
        }
      }))
    );
    
    return res.status(200).json({
      success: true,
      applicants: formattedApplications
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching applications" 
    });
  }
}

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    // Find the applicant that contains the application with the given ID
    const applicant = await Applicant.findOne({ "applications._id": applicationId })
      .populate("user", "name email")
      .populate({
        path: "applications.vacancy",
        populate: { path: "department", select: "dep_name" }
      });
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      });
    }
    
    // Find the specific application
    const application = applicant.applications.find(app => 
      app._id.toString() === applicationId
    );
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      });
    }
    
    // Format the response
    const formattedApplication = {
      _id: application._id,
      applicantId: applicant._id,
      name: applicant.name || "Unknown",
      fullName: applicant.name || "Unknown",
      email: applicant.email || "No email provided",
      phone: applicant.phone || "No phone provided",
      status: application.status || "pending",
      applicationDate: application.applicationDate || application.createdAt || new Date(),
      resume: application.resume,
      feedback: application.feedback || "",
      vacancy: application.vacancy || {},
      education: applicant.education.length > 0 ? applicant.education[0] : {
        degree: "N/A",
        institution: "N/A",
        fieldOfStudy: "N/A",
        graduationYear: "N/A"
      },
      experience: applicant.experience.length > 0 ? applicant.experience[0] : null,
      user: {
        _id: applicant.user?._id,
        name: applicant.user?.name || applicant.name || "Unknown"
      }
    };
    
    return res.status(200).json({
      success: true,
      applicant: formattedApplication
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching application" 
    });
  }
}

// Get applications for a specific user
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const applicant = await Applicant.findOne({ user: userId })
      .populate({
        path: "applications.vacancy",
        populate: { path: "department", select: "dep_name" }
      });
    
    if (!applicant) {
      return res.status(200).json({
        success: true,
        applications: []
      });
    }
    
    // Format the response
    const formattedApplications = applicant.applications.map(app => ({
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
      education: applicant.education.length > 0 ? applicant.education[0] : {
        degree: "N/A",
        institution: "N/A",
        fieldOfStudy: "N/A",
        graduationYear: "N/A"
      },
      experience: applicant.experience.length > 0 ? applicant.experience[0] : null,
      user: {
        _id: applicant.user || userId,
        name: applicant.name || "Unknown"
      }
    }));
    
    return res.status(200).json({
      success: true,
      applications: formattedApplications
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error in fetching applications" 
    });
  }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    // Find the applicant containing the application with the given ID
    const applicant = await Applicant.findOne({ "applications._id": id });
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      });
    }
    
    // Find and update the specific application
    const applicationIndex = applicant.applications.findIndex(app => 
      app._id.toString() === id
    );
    
    if (applicationIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      });
    }
    
    // Update status and feedback
    applicant.applications[applicationIndex].status = status;
    
    if (feedback) {
      applicant.applications[applicationIndex].feedback = feedback;
    }
    
    await applicant.save();
    
    // TODO: Send notification to applicant about status change
    
    return res.status(200).json({
      success: true,
      message: "Application status updated successfully"
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error in updating application status" 
    });
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

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the applicant containing the application with the given ID
    const applicant = await Applicant.findOne({ "applications._id": id });
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false, 
        error: "Application not found" 
      });
    }
    
    // Remove the application from the applications array
    applicant.applications = applicant.applications.filter(
      app => app._id.toString() !== id
    );
    
    await applicant.save();
    
    return res.status(200).json({
      success: true,
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error in deleting application" 
    });
  }
}

export {
  applyForJob,
  upload,
  getAllApplications,
  getApplicationById,
  getUserApplications,
  updateApplicationStatus,
  registerApplicant,
  deleteApplication
}