"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa"

const VacancyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vacancy, setVacancy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVacancyDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Authentication token is missing. Please log in again.")
          setLoading(false)
          return
        }

        console.log("Fetching vacancy details for ID:", id)
        
        const response = await axios.get(`http://localhost:5000/api/vacancies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Vacancy details response:", response.data)

        if (response.data.success && response.data.vacancy) {
          setVacancy(response.data.vacancy)
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

    fetchVacancyDetails()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      
      await axios.delete(`http://localhost:5000/api/vacancies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      navigate("/admin-dashboard/vacancies")
    } catch (error) {
      console.error("Error deleting vacancy:", error)
      alert("Failed to delete vacancy. Please try again.")
    }
  }

  const getStatusBadge = () => {
    if (!vacancy) return null

    if (vacancy.requestStatus === "approved") {
      return (
        <div className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
          <FaCheckCircle className="mr-1" /> Approved
        </div>
      )
    } else if (vacancy.requestStatus === "rejected") {
      return (
        <div className="inline-flex items-center bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
          <FaTimesCircle className="mr-1" /> Rejected
        </div>
      )
    } else if (vacancy.requestStatus === "pending") {
      return (
        <div className="inline-flex items-center bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
          <FaTimesCircle className="mr-1" /> Pending
        </div>
      )
    }
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link to="/admin-dashboard/vacancies" className="flex items-center text-teal-600 hover:text-teal-800">
            <FaArrowLeft className="mr-2" /> Back to Vacancies
          </Link>
        </div>
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      </div>
    )
  }

  if (!vacancy) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link to="/admin-dashboard/vacancies" className="flex items-center text-teal-600 hover:text-teal-800">
            <FaArrowLeft className="mr-2" /> Back to Vacancies
          </Link>
        </div>
        <div className="p-4 bg-amber-100 text-amber-700 rounded-md">Vacancy not found</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/admin-dashboard/vacancies" className="flex items-center text-teal-600 hover:text-teal-800">
          <FaArrowLeft className="mr-2" /> Back to Vacancies
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin-dashboard/edit-vacancy/${id}`)}
            className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>

      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        vacancy.requestStatus === "rejected" ? "border-2 border-red-300" : ""
      }`}>
        <div className={`p-6 ${
          vacancy.requestStatus === "rejected" ? "bg-red-50" : "bg-teal-50"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vacancy.position}</h1>
              <p className="text-lg text-gray-600 mt-1">
                {vacancy.department?.dep_name || "Department"} Department
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold text-lg mb-2">Basic Details</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Positions Available</p>
                  <p className="font-medium">{vacancy.quantity}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">${vacancy.salary?.toLocaleString() || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{vacancy.status}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Application Deadline</p>
                  <p className="font-medium">{formatDate(vacancy.endDate)}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p className="font-medium">{formatDate(vacancy.createdAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Qualifications</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Required Experience</p>
                  <p className="font-medium">{vacancy.experience || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Required Education</p>
                  <p className="font-medium">{vacancy.eduLevel || "N/A"}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Gender Preference</p>
                  <p className="font-medium capitalize">{vacancy.gender || "Any"}</p>
                </div>
                {vacancy.cgpa && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Minimum CGPA</p>
                    <p className="font-medium">{vacancy.cgpa}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Job Description</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-line">{vacancy.description}</p>
            </div>
          </div>

          {vacancy.justification && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Justification</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{vacancy.justification}</p>
              </div>
            </div>
          )}

          {vacancy.requestStatus === "rejected" && vacancy.feedback && (
            <div>
              <h2 className="font-semibold text-lg mb-2 text-red-700">Rejection Feedback</h2>
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <p className="whitespace-pre-line text-red-700">{vacancy.feedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VacancyDetails 