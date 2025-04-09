"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { FaArrowLeft, FaSave } from "react-icons/fa"

const EditVacancy = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    position: "",
    department: "",
    location: "",
    employmentType: "Full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    salary: "",
    applicationDeadline: "",
    isActive: true
  })

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/departments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }

    const fetchVacancyDetails = async () => {
      try {
        console.log("Fetching vacancy with ID:", id)
        const response = await axios.get(`http://localhost:5000/api/vacancies/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          const vacancy = response.data.vacancy
          console.log("Fetched vacancy data:", vacancy)
          
          // Format date for form input
          const deadlineDate = vacancy.applicationDeadline 
            ? new Date(vacancy.applicationDeadline).toISOString().split('T')[0]
            : "";
          
          setFormData({
            position: vacancy.position || "",
            department: vacancy.department?._id || "",
            location: vacancy.location || "",
            employmentType: vacancy.employmentType || "Full-time",
            description: vacancy.description || "",
            requirements: vacancy.requirements || "",
            responsibilities: vacancy.responsibilities || "",
            salary: vacancy.salary || "",
            applicationDeadline: deadlineDate,
            isActive: vacancy.isActive !== false
          })
        } else {
          setError("Failed to load vacancy details")
        }
      } catch (error) {
        console.error("Error fetching vacancy details:", error)
        setError("Failed to load vacancy details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
    fetchVacancyDetails()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      console.log("Submitting form data:", formData)
      const response = await axios.put(
        `http://localhost:5000/api/vacancies/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
        }
      )

      console.log("Server response:", response.data)

      if (response.data.success) {
        alert("Vacancy updated successfully!")
        navigate(`/admin-dashboard/vacancy/${id}`)
      } else {
        setError("Failed to update vacancy")
        setSubmitting(false)
      }
    } catch (error) {
      console.error("Error updating vacancy:", error)
      
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
        setError(`Failed to update: ${error.response.data.message || error.message}`)
      } else if (error.request) {
        console.error("No response received:", error.request)
        setError("No response received from server. Please check your connection.")
      } else {
        setError(`Error: ${error.message}`)
      }
      
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
        <Link to={`/admin-dashboard/vacancy/${id}`} className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Vacancy Details
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to={`/admin-dashboard/vacancy/${id}`} className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Vacancy Details
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Edit Vacancy</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position Title*
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department*
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.dep_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type*
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. $50,000 - $70,000"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline*
                  </label>
                  <input
                    type="date"
                    id="applicationDeadline"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">
                    Active vacancy (visible to applicants)
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements*
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter job requirements - education, experience, skills, etc."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibilities*
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter job responsibilities and duties"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              <FaSave className="mr-2" /> {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditVacancy 