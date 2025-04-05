import JobVacancy from "../models/JobVacancy.js"

// Add new job vacancy
const addVacancy = async (req, res) => {
  try {
    const { position, department, quantity, salary, experience, eduLevel, endDate, gender, cgpa, description } =
      req.body

    const newVacancy = new JobVacancy({
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
    })

    await newVacancy.save()
    return res.status(201).json({
      success: true,
      message: "Job vacancy posted successfully",
      vacancy: newVacancy,
    })
  } catch (error) {
    console.error("Error adding vacancy:", error)
    return res.status(500).json({ success: false, error: "Server error in adding vacancy" })
  }
}

// Get all job vacancies
const getVacancies = async (req, res) => {
  try {
    const vacancies = await JobVacancy.find().populate("department").sort({ createdAt: -1 })
    return res.status(200).json({ success: true, vacancies })
  } catch (error) {
    console.error("Error fetching vacancies:", error)
    return res.status(500).json({ success: false, error: "Server error in fetching vacancies" })
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

export { addVacancy, getVacancies, getVacancy, updateVacancy, deleteVacancy }

