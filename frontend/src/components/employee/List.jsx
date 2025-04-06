"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const List = () => {
  const [employees, setEmployees] = useState([])
  const [empLoading, setEmpLoading] = useState(false)
  const [filteredEmployee, setFilteredEmployee] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true)
      try {
        const response = await axios.get("http://localhost:5000/api/employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (response.data.success) {
          let sno = 1
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department?.dep_name || "Not Assigned",
            name: emp.userId?.name || "Unknown",
            email: emp.userId?.email || "Not Available",
            designation: emp.designation || "Not Assigned",
            dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "Not Available",
            profileImage: emp.userId?.profileImage,
            userId: emp.userId?._id,
          }))
          setEmployees(data)
          setFilteredEmployee(data)
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setEmpLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleFilter = (e) => {
    const records = employees.filter((emp) => emp.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilteredEmployee(records)
  }

  const handleViewEmployee = (id) => {
    navigate(`/admin-dashboard/employees/${id}`)
  }

  const handleEditEmployee = (id) => {
    navigate(`/admin-dashboard/employees/edit/${id}`)
  }

  const handleSalaryEmployee = (id) => {
    navigate(`/admin-dashboard/employees/salary/${id}`)
  }

  const handleLeaveEmployee = (id) => {
    // Navigate to the leave management page for this employee
    navigate(`/admin-dashboard/leave`)
  }

  return (
    <div className="p-5">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Employee Name"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 bg-teal-600 rounded-lg text-white hover:bg-teal-700 transition-colors"
        >
          Add New Employee
        </Link>
      </div>

      {/* Employee Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployee.map((emp) => (
          <div key={emp._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-teal-600 h-24"></div>
            <div className="relative px-4 py-4 pt-12">
              <div className="absolute -top-10 left-4">
                {emp.profileImage ? (
                  <img
                    src={`http://localhost:5000/${emp.profileImage}`}
                    alt={`${emp.name}'s profile`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white">
                    <span className="text-3xl text-gray-500">{emp.name?.[0] || "?"}</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold">{emp.name}</h3>
              <p className="text-gray-600 text-sm">{emp.designation}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>{emp.dep_name}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleViewEmployee(emp._id)}
                  className="text-center px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditEmployee(emp._id)}
                  className="text-center px-2 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleSalaryEmployee(emp._id)}
                  className="text-center px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                  Salary
                </button>
                <button
                  onClick={() => handleLeaveEmployee(emp._id)}
                  className="text-center px-2 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List

