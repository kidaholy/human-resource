"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setProfile(response.data.employee)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    // Mock data for demonstration
    const mockProfile = {
      userId: {
        name: "John Doe",
        email: "john.doe@example.com",
        profileImage: "uploads/1621234567890.jpg",
      },
      employeeId: "EMP001",
      dob: "1990-05-15",
      gender: "male",
      maritalStatus: "married",
      designation: "Senior Lecturer",
      department: {
        _id: "dep123",
        dep_name: "Computer Science",
        description: "Department of Computer Science and Engineering",
      },
      salary: 50000,
    }

    // Simulate API call
    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return <div className="p-4">Loading profile...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!profile) return <div className="p-4">No profile data found</div>

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Employee Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:5000/${profile.userId.profileImage}`}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border-4 border-teal-500"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg?height=200&width=200"
            }}
          />
          <h3 className="text-xl font-semibold mt-4">{profile.userId.name}</h3>
          <p className="text-gray-600">{profile.designation}</p>
          <p className="text-teal-600 font-medium mt-2">ID: {profile.employeeId}</p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile.userId.email}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{profile.department.dep_name}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{new Date(profile.dob).toLocaleDateString()}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium capitalize">{profile.gender}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Marital Status</p>
              <p className="font-medium capitalize">{profile.maritalStatus}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium">${profile.salary.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Department Information</h4>
            <p className="text-gray-700">{profile.department.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile

