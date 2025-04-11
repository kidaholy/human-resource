import Salary from "../models/Salary.js"
import Employee from "../models/Employee.js"

const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body
    const totalSalary = Number.parseInt(basicSalary) + Number.parseInt(allowances) - Number.parseInt(deductions)

    // Create new salary record
    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    })

    await newSalary.save()

    // Update employee's basic salary
    await Employee.findByIdAndUpdate(employeeId, { salary: basicSalary })

    return res.status(200).json({ success: true, message: "Salary added" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: "salary server error" })
  }
}

const getSalary = async (req, res) => {
  try {
    const { id } = req.params
    const salary = await Salary.find({ employeeId: id }).populate("employeeId", "employeeId").sort({ payDate: -1 }) // Sort by payDate in descending order
    return res.status(200).json({ success: true, salary })
  } catch (error) {
    res.status(500).json({ success: false, error: "server error in getting salaries" })
  }
}

// Get latest salary for an employee
const getLatestSalary = async (req, res) => {
  try {
    const { id } = req.params
    const salary = await Salary.findOne({ employeeId: id })
      .sort({ payDate: -1 }) // Get the most recent salary
      .select("basicSalary allowances deductions netSalary payDate")

    if (!salary) {
      return res.status(404).json({ success: false, error: "No salary records found" })
    }

    return res.status(200).json({ success: true, salary })
  } catch (error) {
    console.error("Error getting latest salary:", error)
    res.status(500).json({ success: false, error: "server error in getting latest salary" })
  }
}

// Get monthly total payroll
const getMonthlyTotal = async (req, res) => {
  try {
    // Get current month's start and end dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Find all salaries for the current month
    const salaries = await Salary.find({
      payDate: { $gte: startOfMonth, $lte: endOfMonth },
    })

    // Calculate total
    const total = salaries.reduce((sum, salary) => sum + salary.netSalary, 0)

    return res.status(200).json({ success: true, total })
  } catch (error) {
    console.error("Error calculating monthly payroll:", error)
    return res.status(500).json({ success: false, error: "Server error in calculating monthly payroll" })
  }
}

// Get salary history for an employee by user ID
const getEmployeeSalaryHistory = async (req, res) => {
  try {
    const { employeeId } = req.params
    console.log("Looking up salary history for user ID:", employeeId)

    // First, try to find the employee record associated with this user ID
    const employee = await Employee.findOne({ userId: employeeId })

    if (!employee) {
      console.log("No employee found with userId:", employeeId)

      // As a fallback, check if the ID is directly an employee ID
      const directEmployee = await Employee.findById(employeeId)

      if (!directEmployee) {
        console.log("No employee found with _id:", employeeId)
        return res.status(404).json({
          success: false,
          message: "No employee record found for this user",
          userId: employeeId,
        })
      }

      console.log("Found employee directly by _id:", directEmployee._id)

      // Get salary records for this employee
      const salaries = await Salary.find({ employeeId: directEmployee._id }).sort({ payDate: -1 })

      console.log(`Found ${salaries.length} salary records for employee`)

      // Format the data for the frontend
      const formattedSalaries = salaries.map((salary) => {
        const payDate = new Date(salary.payDate)
        return {
          _id: salary._id,
          basicSalary: salary.basicSalary,
          allowances: salary.allowances,
          deductions: salary.deductions,
          netSalary: salary.netSalary,
          paymentDate: salary.payDate,
          month: payDate.toLocaleString("default", { month: "long" }),
          year: payDate.getFullYear(),
        }
      })

      return res.status(200).json(formattedSalaries)
    }

    console.log("Found employee with userId:", employee._id)

    // Get salary records for this employee
    const salaries = await Salary.find({ employeeId: employee._id }).sort({ payDate: -1 })

    console.log(`Found ${salaries.length} salary records for employee`)

    // Format the data for the frontend
    const formattedSalaries = salaries.map((salary) => {
      const payDate = new Date(salary.payDate)
      return {
        _id: salary._id,
        basicSalary: salary.basicSalary,
        allowances: salary.allowances,
        deductions: salary.deductions,
        netSalary: salary.netSalary,
        paymentDate: salary.payDate,
        month: payDate.toLocaleString("default", { month: "long" }),
        year: payDate.getFullYear(),
      }
    })

    return res.status(200).json(formattedSalaries)
  } catch (error) {
    console.error("Error getting employee salary history:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in getting employee salary history",
      message: error.message,
    })
  }
}

// Create a mock salary for testing
const createMockSalary = async (req, res) => {
  try {
    const { userId } = req.params

    // Find the employee associated with this user
    const employee = await Employee.findOne({ userId: userId })

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "No employee record found for this user",
      })
    }

    // Create a mock salary record
    const mockSalary = new Salary({
      employeeId: employee._id,
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      payDate: new Date(),
    })

    await mockSalary.save()

    return res.status(201).json({
      success: true,
      message: "Mock salary created for testing",
      salary: mockSalary,
    })
  } catch (error) {
    console.error("Error creating mock salary:", error)
    return res.status(500).json({
      success: false,
      error: "Server error in creating mock salary",
      message: error.message,
    })
  }
}

export { addSalary, getSalary, getLatestSalary, getMonthlyTotal, getEmployeeSalaryHistory, createMockSalary }
