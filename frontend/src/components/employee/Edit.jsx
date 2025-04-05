"use client"

import { useEffect, useState } from "react"
import { fetchDepartments } from "../../utils/EmployeeHelper"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const Edit = () => {
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: 0,
    department: "",
  })
  const [departments, setDepartments] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments()
  }, [])
  useEffect(() => {
    const fetchEmplopyee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (response.data.success) {
          const employee = response.data.employee
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department,
          }))
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    }
    fetchEmplopyee()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmployee((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put(`http://localhost:5000/api/employees/${id}`, employee, {
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
      {departments && employee ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Edit Employee Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  placeholder="Insert Name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select
                  name="maritalStatus"
                  onChange={handleChange}
                  value={employee.maritalStatus}
                  placeholder="Marital Status"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  onChange={handleChange}
                  value={employee.designation}
                  placeholder="Designation"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="number"
                  name="salary"
                  onChange={handleChange}
                  value={employee.salary}
                  placeholder="Salary"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Department */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  type="text"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
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
            </div>
            <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md">
              Edit Employee
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default Edit

