"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
    departmentHead: "",
  })
  const [eligibleHeads, setEligibleHeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch all employees
        const response = await axios.get(`http://localhost:5000/api/employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          // Filter out admins
          const filteredEmployees = response.data.employees.filter((emp) => emp.userId && emp.userId.role !== "admin")
          setEligibleHeads(filteredEmployees)
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        setError("Failed to load employees. Please try again.")
        if (error.response && error.response.data) {
          console.log(error.response.data.error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDepartment({ ...department, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/api/departments/add", department, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.data.success) {
        navigate("/admin-dashboard/departments")
      }
    } catch (error) {
      console.error("Error adding department:", error)
      setError("Failed to add department. Please try again.")
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Add New Department</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Loading employees...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
              Department Name
            </label>
            <input
              type="text"
              name="dep_name"
              onChange={handleChange}
              placeholder="Enter Dep Name"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mt-3">
            <label htmlFor="departmentHead" className="block text-sm font-medium text-gray-700">
              Department Head
            </label>
            <select
              name="departmentHead"
              value={department.departmentHead}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Department Head</option>
              {eligibleHeads.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.userId?.name || "Unknown"} - {emp.designation || "No designation"}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Note: Assigning a department head will update their role to department_head.
            </p>
          </div>

          <div className="mt-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              type="text"
              name="description"
              onChange={handleChange}
              placeholder="Description"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add Department
          </button>
        </form>
      )}
    </div>
  )
}

export default AddDepartment

