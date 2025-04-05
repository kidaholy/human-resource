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

export { addSalary, getSalary }

