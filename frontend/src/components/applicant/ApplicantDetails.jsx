"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGraduationCap,
  FaBuilding,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash
} from "react-icons/fa"

const ApplicantDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingAction, setProcessingAction] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [actionType, setActionType] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/applicants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setApplicant(response.data.applicant)
        } else {
          setError("Failed to load applicant details")
        }
      } catch (error) {
        console.error("Error fetching applicant details:", error)
        setError("Failed to load applicant details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchApplicantDetails()
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setProcessingAction(true)
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applicants/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (response.data.success) {
        setApplicant((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (error) {
      console.error("Error updating status:", error)
      setError("Failed to update status. Please try again.")
    } finally {
      setProcessingAction(false)
    }
  }

  const handleDelete = async () => {
    setProcessingAction(true)
    try {
      const response = await axios.delete(`http://localhost:5000/api/applicants/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        navigate("/admin-dashboard/applicants")
      }
    } catch (error) {
      console.error("Error deleting applicant:", error)
      setError("Failed to delete applicant. Please try again.")
    } finally {
      setProcessingAction(false)
    }
  }

  const submitFeedback = async () => {
    setProcessingAction(true)
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applicants/${id}`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (response.data.success) {
        setApplicant((prev) => ({ ...prev, feedback }))
        setShowFeedbackModal(false)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setError("Failed to submit feedback. Please try again.")
    } finally {
      setProcessingAction(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!applicant) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
        <p className="text-yellow-700">Applicant not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/admin-dashboard/applicants"
                className="text-teal-600 hover:text-teal-700 mr-4"
              >
                <FaArrowLeft className="text-xl" />
              </Link>
              <h2 className="text-xl font-bold text-gray-800">Applicant Details</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange("shortlisted")}
                disabled={processingAction}
                className="px-4 py-2 bg-blue-50 text-blue-700 border-2 border-blue-500 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-colors duration-200"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleStatusChange("rejected")}
                disabled={processingAction}
                className="px-4 py-2 bg-red-50 text-red-700 border-2 border-red-500 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors duration-200"
              >
                Reject
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                disabled={processingAction}
                className="px-4 py-2 bg-teal-50 text-teal-700 border-2 border-teal-500 rounded-md hover:bg-teal-100 disabled:opacity-50 transition-colors duration-200"
              >
                Add Feedback
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                disabled={processingAction}
                className="px-4 py-2 bg-red-50 text-red-700 border-2 border-red-500 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3" />
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{applicant.fullName}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{applicant.email}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-400 mr-3" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{applicant.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-3" />
                  <span className="text-gray-600">Applied On:</span>
                  <span className="ml-2 font-medium">
                    {new Date(applicant.applicationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaGraduationCap className="text-gray-400 mr-3" />
                  <span className="text-gray-600">Degree:</span>
                  <span className="ml-2 font-medium">{applicant.education?.degree || "Not specified"}</span>
                </div>
                <div className="flex items-center">
                  <FaBuilding className="text-gray-400 mr-3" />
                  <span className="text-gray-600">Institution:</span>
                  <span className="ml-2 font-medium">{applicant.education?.institution || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Experience</h3>
              {applicant.experience ? (
                <div className="space-y-4">
                  {Array.isArray(applicant.experience) ? (
                    applicant.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-teal-500 pl-4">
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-gray-600">{exp.company}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                        </div>
                        <div className="mt-2 text-gray-700">{exp.description}</div>
                      </div>
                    ))
                  ) : typeof applicant.experience === 'string' ? (
                    <div className="text-gray-700">{applicant.experience}</div>
                  ) : (
                    <div className="text-gray-700">
                      {applicant.experience.title && <div className="font-medium">{applicant.experience.title}</div>}
                      {applicant.experience.company && <div className="text-gray-600">{applicant.experience.company}</div>}
                      {applicant.experience.description && <div className="mt-2">{applicant.experience.description}</div>}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No experience information provided</p>
              )}
            </div>

            {/* Resume */}
            <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Resume</h3>
              {applicant.resume ? (
                <a
                  href={`http://localhost:5000${applicant.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700"
                >
                  <FaFileAlt className="mr-2" />
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </div>

            {/* Status and Feedback */}
            <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Status and Feedback</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      applicant.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : applicant.status === "shortlisted"
                        ? "bg-blue-100 text-blue-800"
                        : applicant.status === "selected"
                        ? "bg-green-100 text-green-800"
                        : applicant.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {applicant.status}
                  </span>
                </div>
                {applicant.feedback && (
                  <div>
                    <span className="text-gray-600">Feedback:</span>
                    <p className="mt-2 text-gray-700">{applicant.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Feedback</h3>
            <textarea
              className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback..."
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  setShowFeedbackModal(false)
                  setFeedback("")
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-50 text-teal-700 border-2 border-teal-500 rounded-md hover:bg-teal-100 transition-colors duration-200"
                onClick={submitFeedback}
                disabled={processingAction}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-50 text-red-700 border-2 border-red-500 rounded-md hover:bg-red-100 transition-colors duration-200"
                onClick={handleDelete}
                disabled={processingAction}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantDetails

