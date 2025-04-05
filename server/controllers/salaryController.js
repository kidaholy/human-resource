import Salary from "../models/Salary.js"
const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body
    const totalSalary = Number.parseInt(basicSalary) + Number.parseInt(allowances) - Number.parseInt(deductions)
    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    })

    await newSalary.save()
    return res.status(200).json({ success: true, message: "Salary added" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: "salary server error" })
  }
}

const getSalary = async (req, res) => {
  try {
    const { id } = req.params
    const salary = await Salary.find({ employeeId: id }).populate("employeeId", "employeeId")
    return res.status(200).json({ success: true, salary })
  } catch (error) {
    res.status(500).json({ success: false, error: "server error in getting salaries" })
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

// Export the new function along with existing ones
export { addSalary, getSalary, getMonthlyTotal }

