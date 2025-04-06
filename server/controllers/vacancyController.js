import JobVacancy from "../models/JobVacancy.js"
import Department from "../models/Department.js"
import Employee from "../models/Employee.js"

// Request a new job vacancy (for department heads)
const requestVacancy = async (req, res) => {
  try {
    const {
      position,
      department,
      quantity,
      salary,
      experience,
      eduLevel,
      endDate,
      gender,
      cgpa,
      description,
      justification,
    } = req.body

    // Verify the user is a department head
    const userId = req.user._id
    const employee = await Employee.findOne({ userId })

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" })
    }

    // Find the department where this employee is the head
    const departmentDoc = await Department.findOne({ departmentHead: employee._id })

    if (!departmentDoc) {
      return res.status(403).json({ success: false, error: "You are not authorized to request vacancies" })
    }

    const newVacancy = new JobVacancy({
      position,
      department: departmentDoc._id,
      quantity,
      salary,
      experience,
      eduLevel,
      endDate,
      gender: gender || "any",
      cgpa,
      description,
      justification,
      requestStatus: "pending",
      requestedBy: userId,
      status: "draft", // Not active until approved
    })

    await newVacancy.save()

    return res.status(201).json({
      success: true,
      message: "Vacancy request submitted successfully",
      vacancy: newVacancy,
    })
  } catch (error) {
    console.error("Error requesting vacancy:", error)
    return res.status(500).json({ success: false, error: "Server error in requesting vacancy" })
  }
}

// Get all vacancy requests (for admin)
const getVacancyRequests = async (req, res) => {
  try {
    const requests = await JobVacancy.find({ requestStatus: "pending" })
      .populate("department")
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, requests })
  } catch (error) {
    console.error("Error fetching vacancy requests:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching vacancy requests" })
  }
}

// Approve or reject a vacancy request (for admin)
const processVacancyRequest = async (req, res) => {
  try {
    const { id } = req.params
    const { action, feedback } = req.body

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, error: "Invalid action" })
    }

    const vacancy = await JobVacancy.findById(id)

    if (!vacancy) {
      return res.status(404).json({ success: false, error: "Vacancy request not found" })
    }

    if (vacancy.requestStatus !== "pending") {
      return res.status(400).json({ success: false, error: "This request has already been processed" })
    }

    if (action === "approve") {
      vacancy.requestStatus = "approved"
      vacancy.status = "active" // Make it active/visible
      vacancy.feedback = feedback || "Your vacancy request has been approved"
    } else {
      vacancy.requestStatus = "rejected"
      vacancy.feedback = feedback || "Your vacancy request has been rejected"
    }

    vacancy.updatedAt = Date.now()
    await vacancy.save()

    return res.status(200).json({
      success: true,
      message: `Vacancy request ${action === "approve" ? "approved" : "rejected"} successfully`,
      vacancy,
    })
  } catch (error) {
    console.error("Error processing vacancy request:", error)
    return res.status(500).json({ success: false, error: "Server error in processing vacancy request" })
  }
}

// Get all job vacancies (only approved ones for public view)
const getVacancies = async (req, res) => {
  try {
    // If the request is from admin, show all vacancies
    const isAdmin = req.user && req.user.role === "admin"

    const filter = isAdmin ? {} : { requestStatus: "approved", status: "active" }

    const vacancies = await JobVacancy.find(filter).populate("department").sort({ createdAt: -1 })

    return res.status(200).json({ success: true, vacancies })
  } catch (error) {
    console.error("Error fetching vacancies:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching vacancies" })
  }
}

// Get public vacancies (no auth required)
const getPublicVacancies = async (req, res) => {
  try {
    const vacancies = await JobVacancy.find({
      requestStatus: "approved",
      status: "active",
    })
      .populate("department")
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, vacancies })
  } catch (error) {
    console.error("Error fetching public vacancies:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching public vacancies" })
  }
}

// Get a specific job vacancy
const getVacancy = async (req, res) => {
  try {
    const { id } = req.params
    const vacancy = await JobVacancy.findById(id).populate("department")

    if (!vacancy) {
      return res.status(404).json({ success: false, error: "Vacancy not found" })
    }

    return res.status(200).json({ success: true, vacancy })
  } catch (error) {
    console.error("Error fetching vacancy:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching vacancy" })
  }
}

// Update a job vacancy
const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const vacancy = await JobVacancy.findById(id)
    if (!vacancy) {
      return res.status(404).json({ success: false, error: "Vacancy not found" })
    }

    // Update the vacancy
    const updatedVacancy = await JobVacancy.findByIdAndUpdate(id, { ...updates, updatedAt: Date.now() }, { new: true })

    return res.status(200).json({
      success: true,
      message: "Vacancy updated successfully",
      vacancy: updatedVacancy,
    })
  } catch (error) {
    console.error("Error updating vacancy:", error)
    return res.status(500).json({ success: false, error: "Server error in updating vacancy" })
  }
}

// Delete a job vacancy
const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params
    const vacancy = await JobVacancy.findById(id)

    if (!vacancy) {
      return res.status(404).json({ success: false, error: "Vacancy not found" })
    }

    await JobVacancy.findByIdAndDelete(id)
    return res.status(200).json({ success: true, message: "Vacancy deleted successfully" })
  } catch (error) {
    console.error("Error deleting vacancy:", error)
    return res.status(500).json({ success: false, error: "Server error in deleting vacancy" })
  }
}

// Get department head's vacancy requests
const getDepartmentHeadVacancies = async (req, res) => {
  try {
    const userId = req.user._id

    // Find all vacancies requested by this user
    const vacancies = await JobVacancy.find({ requestedBy: userId }).populate("department").sort({ createdAt: -1 })

    return res.status(200).json({ success: true, vacancies })
  } catch (error) {
    console.error("Error fetching department head vacancies:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching department head vacancies" })
  }
}

export {
  getVacancies,
  getVacancy,
  updateVacancy,
  deleteVacancy,
  requestVacancy,
  getVacancyRequests,
  processVacancyRequest,
  getPublicVacancies,
  getDepartmentHeadVacancies,
}

