"use client"

import { useEffect, useState } from "react"
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const AddSalary = () => {
  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
  })
  const [departments, setDepartments] = useState(null)
  const [employees, setEmployees] = useState([])
  const navigate = useNavigate()

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value)
    setEmployees(emps)
  }

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSalary((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`http://localhost:5000/api/salary/add`, salary, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.data.success) {
        navigate("/admin-dashboard/employees")
      }
      console.log(response)
    } catch (error) {
      console.log(error)
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      } else {
        alert("An unexpected error occurred.")
      }
    }
  }

  return (
    <>
      {departments && employees ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  type="text"
                  name="department"
                  onChange={handleDepartment}
                  className="mt-1v p-2 block w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  type="text"
                  name="employeeId"
                  onChange={handleChange}
                  className="mt-1v p-2 block w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                <input
                  type="number"
                  name="basicSalary"
                  onChange={handleChange}
                  placeholder="basic salary"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Allowances */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Allowances</label>
                <input
                  type="number"
                  name="allowances"
                  onChange={handleChange}
                  placeholder="aloowances"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Deductions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Deductions</label>
                <input
                  type="number"
                  name="deductions"
                  onChange={handleChange}
                  placeholder="deductions"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Pay Date</label>
                <input
                  type="date"
                  name="payDate"
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button className="w-full mt-6 bg-blue-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">
              Add Salary
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default AddSalary

