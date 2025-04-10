"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { FaUser, FaEnvelope, FaIdCard, FaBriefcase, FaBuilding, FaCalendar, FaPhone } from "react-icons/fa"

const DepartmentEmployeeProfile = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setEmployee(response.data.employee)
        }
      } catch (error) {
        console.error("Error fetching employee profile:", error)
        setError("Failed to load employee profile")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeProfile()
  }, [id])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  if (!employee) {
    return <div className="p-6">Employee not found</div>
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with profile image */}
          <div className="relative h-48 bg-primary-600">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                {employee.userId?.profileImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${employee.userId.profileImage}`}
                    alt={employee.userId.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile information */}
          <div className="pt-16 pb-8 px-6">
            <h1 className="text-2xl font-bold text-gray-900">{employee.userId?.name}</h1>
            <p className="text-gray-500">{employee.designation}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-600">{employee.userId?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaIdCard className="text-gray-400" />
                  <span className="text-gray-600">ID: {employee.employeeId}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaBriefcase className="text-gray-400" />
                  <span className="text-gray-600">{employee.designation}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaBuilding className="text-gray-400" />
                  <span className="text-gray-600">{employee.department?.dep_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <span className="text-gray-600">Joined: {new Date(employee.joiningDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <span className="text-gray-600">{employee.phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Address</h3>
                  <p className="text-gray-600 mt-1">{employee.address || "Not provided"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Emergency Contact</h3>
                  <p className="text-gray-600 mt-1">{employee.emergencyContact || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentEmployeeProfile
