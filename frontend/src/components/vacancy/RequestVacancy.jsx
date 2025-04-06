"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const RequestVacancy = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [departmentId, setDepartmentId] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    salary: "",
    location: "",
    type: "Full-time",
    justification: "",
  })

  useEffect(() => {
    // Get department ID for the department head
    const fetchDepartmentId = async () => {
      try {
        const response = await axios.get(`/api/employees/user/${user.id}`)
        if (response.data && response.data.departmentId) {
          setDepartmentId(response.data.departmentId)
        }
      } catch (error) {
        console.error("Error fetching department:", error)
        setError("Failed to fetch your department information")
      }
    }

    if (user && user.id) {
      fetchDepartmentId()
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create vacancy request
      const requestData = {
        ...formData,
        departmentId,
        status: "pending", // All new requests start as pending
        requestedBy: user.id,
      }

      const response = await axios.post("/api/vacancies/request", requestData)

      setSuccess(true)
      setLoading(false)

      // Redirect to vacancy requests list after 2 seconds
      setTimeout(() => {
        navigate("/department-head-dashboard/my-vacancy-requests")
      }, 2000)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || "Failed to submit vacancy request")
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Request New Position</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Why Request a New Position?</h3>
        <p className="text-blue-700">
          Use this form to request a new position when your department needs additional staff. Provide a detailed
          justification explaining why this role is necessary for your department's operations.
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {success ? (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Your vacancy request has been submitted successfully! It will be reviewed by HR. Redirecting to your vacancy
          requests...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., Senior Software Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range*</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., $60,000 - $80,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., New York, NY (Remote/Hybrid/On-site)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Provide a brief overview of the position..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements*</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="List the qualifications, skills, and experience required..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities*</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the key duties and responsibilities..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Justification for New Position*</label>
            <div className="mb-2 text-sm text-gray-500">
              Explain why this position is necessary. Consider including:
              <ul className="list-disc ml-5 mt-1">
                <li>Current workload challenges</li>
                <li>Department growth or changes</li>
                <li>New projects or initiatives requiring additional staff</li>
                <li>Impact on department performance if position is not filled</li>
              </ul>
            </div>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Provide a detailed justification for why this position is needed..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/department-head-dashboard")}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default RequestVacancy

