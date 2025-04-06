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
    phone: "",
    address: "",
    emergencyContact: "",
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
    const fetchEmployee = async () => {
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
            maritalStatus: employee.maritalStatus || "",
            designation: employee.designation || "",
            salary: employee.salary || 0,
            department: employee.department?._id || "",
            phone: employee.phone || "",
            address: employee.address || "",
            emergencyContact: employee.emergencyContact || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching employee:", error)
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    }

    fetchEmployee()
  }, [id])

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
    } catch (error) {
      console.error("Error updating employee:", error)
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
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  value={employee.phone}
                  placeholder="Phone Number"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
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

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  onChange={handleChange}
                  value={employee.address}
                  placeholder="Enter address"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  rows="3"
                ></textarea>
              </div>

              {/* Emergency Contact */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <textarea
                  name="emergencyContact"
                  onChange={handleChange}
                  value={employee.emergencyContact}
                  placeholder="Emergency contact details"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Update Employee
              </button>
              <a
                href={`/admin-dashboard/add-salary/${id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center"
              >
                Manage Salary
              </a>
              <a
                href={`/admin-dashboard/manage-leave/${id}`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-center"
              >
                Manage Leave
              </a>
            </div>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default Edit

