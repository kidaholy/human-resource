"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null)
  const [salary, setSalary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        // First get the employee details
        const employeeResponse = await axios.get(`http://localhost:5000/api/employees/user/${user._id}`, { headers })

        if (employeeResponse.data.success) {
          setProfile(employeeResponse.data.employee)

          // Fetch the latest salary record
          const salaryResponse = await axios.get(
            `http://localhost:5000/api/salary/${employeeResponse.data.employee._id}/latest`,
            { headers },
          )

          if (salaryResponse.data.success) {
            setSalary(salaryResponse.data.salary)
          }
        } else {
          setError("Failed to load profile data")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchProfile()
    }
  }, [user])

  if (loading) return <div className="p-4">Loading profile...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!profile) return <div className="p-4">No profile data found</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-md shadow-md overflow-hidden">
      {/* Teal header background */}
      <div className="bg-teal-600 h-48 w-full"></div>

      <div className="relative px-6 py-10">
        {/* Profile image */}
        <div className="absolute -top-16 left-6">
          {profile.userId?.profileImage ? (
            <img
              src={`http://localhost:5000/${profile.userId.profileImage}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg"
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white">
              <span className="text-4xl text-gray-500">{profile.userId?.name?.[0] || "?"}</span>
            </div>
          )}
        </div>

        {/* Name and title */}
        <div className="mt-16">
          <h1 className="text-3xl font-bold">{profile.userId?.name}</h1>
          <p className="text-gray-600">{profile.designation || "No Designation"}</p>
        </div>

        {/* Contact information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
              <span>{profile.userId?.email || "No Email"}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <span>ID: {profile.employeeId || "Not Assigned"}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{profile.designation || "No Designation"}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
              <span>{profile.department?.dep_name || "Not Assigned"}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                Joined: {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "Not Available"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{profile.phone || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Address</h3>
              <p>{profile.address || "Not provided"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Emergency Contact</h3>
              <p>{profile.emergencyContact || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Salary Information (if available) */}
        {salary && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Salary Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Basic Salary</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(salary.basicSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Salary</p>
                  <p className="font-medium text-teal-600">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(salary.netSalary)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeProfile

