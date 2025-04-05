"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null)
  const [netSalary, setNetSalary] = useState(null)
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
          const salaryResponse = await axios.get(`http://localhost:5000/api/salary/${employeeResponse.data.employee._id}`, { headers })
          
          if (salaryResponse.data.success && salaryResponse.data.salary.length > 0) {
            // Get the most recent salary record
            const latestSalary = salaryResponse.data.salary[0]
            setNetSalary(latestSalary.netSalary)
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Employee Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          {profile.userId?.profileImage ? (
            <img
              src={`http://localhost:5000/${profile.userId.profileImage}`}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-teal-500"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg"
              }}
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-teal-500">
              <span className="text-4xl text-gray-500">{profile.userId?.name?.[0] || "?"}</span>
            </div>
          )}
          <h3 className="text-xl font-semibold mt-4">{profile.userId?.name}</h3>
          <p className="text-gray-600">{profile.designation || "No Designation"}</p>
          <p className="text-teal-600 font-medium mt-2">ID: {profile.employeeId}</p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile.userId?.email || "No Email"}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{profile.department?.dep_name || "Not Assigned"}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">
                {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not Available"}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium capitalize">{profile.gender || "Not Specified"}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Marital Status</p>
              <p className="font-medium capitalize">{profile.maritalStatus || "Not Specified"}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Basic Salary</p>
              <p className="font-medium">
                {profile.salary ? formatCurrency(profile.salary) : "Not Available"}
              </p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Net Salary (Current Month)</p>
              <p className="font-medium text-green-600">
                {netSalary ? formatCurrency(netSalary) : "Not Available"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Department Information</h4>
            <p className="text-gray-700">{profile.department?.description || "No department information available"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile

