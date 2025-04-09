"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { FaArrowLeft, FaSave } from "react-icons/fa"

const EditApplicant = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    education: {
      degree: "",
      institution: "",
      graduationYear: "",
      cgpa: ""
    },
    experience: "",
    status: ""
  })

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        console.log("Fetching applicant with ID:", id)
        const response = await axios.get(`http://localhost:5000/api/applicants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          const applicant = response.data.applicant
          console.log("Fetched applicant data:", applicant)
          
          // Set form data from applicant data, with fallbacks for all fields
          setFormData({
            fullName: applicant.fullName || applicant.name || "",
            email: applicant.email || "",
            phone: applicant.phone || "",
            dob: applicant.dob ? new Date(applicant.dob).toISOString().split('T')[0] : "",
            gender: applicant.gender || "",
            education: {
              degree: applicant.education?.degree || "",
              institution: applicant.education?.institution || "",
              graduationYear: applicant.education?.graduationYear || "",
              cgpa: applicant.education?.cgpa || ""
            },
            experience: applicant.experience || "",
            status: applicant.status || "pending"
          })
          
          console.log("Form data initialized")
        } else {
          setError("Failed to load applicant details")
        }
      } catch (error) {
        console.error("Error fetching applicant details:", error)
        if (error.response) {
          console.error("Response data:", error.response.data)
          console.error("Response status:", error.response.status)
          setError(`Failed to load: ${error.response.data.message || error.message}`)
        } else if (error.request) {
          setError("No response received from server. Please check your connection.")
        } else {
          setError(`Error: ${error.message}`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchApplicantDetails()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    // Format date if needed
    let formattedData = {
      ...formData,
      education: formData.education || {
        degree: "",
        institution: "",
        graduationYear: "",
        cgpa: ""
      }
    };
    
    // Log the data being sent to help with debugging
    console.log("Submitting form data:", formattedData)
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applicants/${id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
        }
      )

      console.log("Server response:", response.data)

      if (response.data.success) {
        alert("Applicant information updated successfully!")
        navigate(`/admin-dashboard/applicants/${id}`)
      } else {
        setError("Failed to update applicant details")
        setSaving(false)
      }
    } catch (error) {
      console.error("Error updating applicant:", error)
      
      // Display more detailed error information
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
      
      setSaving(false)
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
        <Link to={`/admin-dashboard/applicants/${id}`} className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Applicant Details
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to={`/admin-dashboard/applicants/${id}`} className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Applicant Details
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Edit Applicant Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Education & Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="education.degree" className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    id="education.degree"
                    name="education.degree"
                    value={formData.education.degree}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="education.institution" className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    id="education.institution"
                    name="education.institution"
                    value={formData.education.institution}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="education.graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    id="education.graduationYear"
                    name="education.graduationYear"
                    value={formData.education.graduationYear}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="education.cgpa" className="block text-sm font-medium text-gray-700 mb-1">
                    CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="education.cgpa"
                    name="education.cgpa"
                    value={formData.education.cgpa}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Experience</h3>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
            >
              <FaSave className="mr-2" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditApplicant 