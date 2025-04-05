"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const EditDepartment = () => {
  const { id } = useParams()
  const [departments, setDepartments] = useState({
    dep_name: "",
    description: "",
    departmentHead: "",
  })
  const [depLoading, setDepLoading] = useState(false)
  const [eligibleHeads, setEligibleHeads] = useState([])
  const [currentHead, setCurrentHead] = useState(null)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDepartmentAndEmployees = async () => {
      setDepLoading(true)
      setError(null)

      try {
        // Fetch department details
        const response = await axios.get(`http://localhost:5000/api/departments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          const dept = response.data.departments
          setDepartments({
            dep_name: dept.dep_name,
            description: dept.description,
            departmentHead: dept.departmentHead ? dept.departmentHead._id : "",
          })

          if (dept.departmentHead) {
            setCurrentHead(dept.departmentHead)
          }
        }

        // Fetch all employees
        const employeesResponse = await axios.get(`http://localhost:5000/api/employees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (employeesResponse.data.success) {
          // Use all employees as potential department heads
          setEligibleHeads(employeesResponse.data.employees)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again.")
        if (error.response && error.response.data) {
          console.log(error.response.data.error)
        }
      } finally {
        setDepLoading(false)
      }
    }

    fetchDepartmentAndEmployees()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDepartments({ ...departments, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await axios.put(`http://localhost:5000/api/departments/${id}`, departments, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.data.success) {
        navigate("/admin-dashboard/departments")
      }
    } catch (error) {
      console.error("Error updating department:", error)
      setError("Failed to update department. Please try again.")
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      }
    }
  }

  return (
    <>
      {depLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Update Department</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                type="text"
                name="dep_name"
                onChange={handleChange}
                value={departments.dep_name}
                placeholder="Enter Dep Name"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="departmentHead" className="block text-sm font-medium text-gray-700">
                Department Head
              </label>
              <select
                name="departmentHead"
                value={departments.departmentHead}
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
                Note: Changing department head will update user roles accordingly.
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
                value={departments.description}
                placeholder="Description"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <button
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Update Department
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default EditDepartment

