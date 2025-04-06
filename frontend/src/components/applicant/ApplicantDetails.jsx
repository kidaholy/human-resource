"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
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
} from "react-icons/fa"

const ApplicantDetails = () => {
  const { id } = useParams()
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingAction, setProcessingAction] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [actionType, setActionType] = useState(null)

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applicants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setApplicant(response.data.applicant)
        } else {
          // If API doesn't return success, use mock data
          setApplicant({
            _id: id,
            fullName: "John Smith",
            email: "john.smith@example.com",
            phone: "+1234567890",
            dob: "1985-05-15",
            gender: "male",
            vacancy: {
              _id: "vac1",
              position: "Senior Lecturer",
              department: { dep_name: "Computer Science" },
            },
            education: {
              degree: "PhD in Computer Science",
              institution: "Harvard University",
              graduationYear: 2018,
              cgpa: 3.9,
            },
            experience:
              "10 years of teaching experience in top universities. Research focus on artificial intelligence and machine learning.",
            resume: "/path/to/resume.pdf",
            status: "pending",
            createdAt: "2023-06-15T10:30:00Z",
            feedback: "",
          })
        }
      } catch (error) {
        console.error("Error fetching applicant details:", error)
        setError("Failed to load applicant details. Please try again later.")

        // Use mock data if API fails
        setApplicant({
          _id: id,
          fullName: "John Smith",
          email: "john.smith@example.com",
          phone: "+1234567890",
          dob: "1985-05-15",
          gender: "male",
          vacancy: {
            _id: "vac1",
            position: "Senior Lecturer",
            department: { dep_name: "Computer Science" },
          },
          education: {
            degree: "PhD in Computer Science",
            institution: "Harvard University",
            graduationYear: 2018,
            cgpa: 3.9,
          },
          experience:
            "10 years of teaching experience in top universities. Research focus on artificial intelligence and machine learning.",
          resume: "/path/to/resume.pdf",
          status: "pending",
          createdAt: "2023-06-15T10:30:00Z",
          feedback: "",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApplicantDetails()
  }, [id])

  const handleAction = (action) => {
    setActionType(action)
    setFeedback("")
    setShowFeedbackModal(true)
  }

  const submitAction = async () => {
    if (!actionType) return

    const newStatus =
      actionType === "shortlist"
        ? "shortlisted"
        : actionType === "select"
          ? "selected"
          : actionType === "reject"
            ? "rejected"
            : "pending"

    setProcessingAction(true)

    try {
      const response = await axios.put(
        `http://localhost:5000/api/applicants/${id}/status`,
        {
          status: newStatus,
          feedback: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        // Update local state
        setApplicant((prev) => ({
          ...prev,
          status: newStatus,
          feedback: feedback,
        }))
        setShowFeedbackModal(false)
      }
    } catch (error) {
      console.error("Error updating applicant status:", error)
      alert("Failed to update applicant status. Please try again.")
    } finally {
      setProcessingAction(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
      case "shortlisted":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Shortlisted</span>
      case "interviewed":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Interviewed</span>
        )
      case "selected":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Selected</span>
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>
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
        <Link to="/admin-dashboard/applicants" className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Applicants
        </Link>
      </div>
    )
  }

  if (!applicant) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Applicant not found</p>
        </div>
        <Link to="/admin-dashboard/applicants" className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Applicants
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin-dashboard/applicants" className="text-teal-600 hover:text-teal-700 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Applicants
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-bold">{applicant.fullName}</h2>
              <p className="text-teal-100">
                Application for {applicant.vacancy.position} - {applicant.vacancy.department.dep_name}
              </p>
            </div>
            <div className="mt-4 md:mt-0">{getStatusBadge(applicant.status)}</div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaUser className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p>{applicant.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaEnvelope className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{applicant.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaPhone className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>{applicant.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaCalendarAlt className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p>{new Date(applicant.dob).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaUser className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Gender</p>
                    <p className="capitalize">{applicant.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Education</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaGraduationCap className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Degree</p>
                    <p>{applicant.education.degree}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaBuilding className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Institution</p>
                    <p>{applicant.education.institution}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaCalendarAlt className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">Graduation Year</p>
                    <p>{applicant.education.graduationYear}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-gray-500 w-10">
                    <FaGraduationCap className="mt-1" />
                  </div>
                  <div>
                    <p className="font-medium">CGPA</p>
                    <p>{applicant.education.cgpa}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Experience</h3>
            <p className="whitespace-pre-line">{applicant.experience || "No experience provided"}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Resume</h3>
            <div className="flex items-center">
              <FaFileAlt className="text-gray-500 mr-2" />
              <a
                href={applicant.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700"
              >
                View Resume
              </a>
            </div>
          </div>

          {applicant.feedback && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Feedback</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{applicant.feedback}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            {applicant.status === "pending" && (
              <>
                <button
                  onClick={() => handleAction("shortlist")}
                  disabled={processingAction}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
                >
                  <FaCheck className="mr-2" /> Shortlist
                </button>
                <button
                  onClick={() => handleAction("reject")}
                  disabled={processingAction}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
                >
                  <FaTimes className="mr-2" /> Reject
                </button>
              </>
            )}

            {applicant.status === "shortlisted" && (
              <button
                onClick={() => handleAction("select")}
                disabled={processingAction}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
              >
                <FaCheck className="mr-2" /> Select
              </button>
            )}

            {(applicant.status === "shortlisted" || applicant.status === "selected") && (
              <button
                onClick={() => handleAction("reject")}
                disabled={processingAction}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
              >
                <FaTimes className="mr-2" /> Reject
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {actionType === "shortlist"
                ? "Shortlist Applicant"
                : actionType === "select"
                  ? "Select Applicant"
                  : "Reject Application"}
            </h3>
            <p className="mb-4">
              {actionType === "shortlist"
                ? "Provide feedback for shortlisting"
                : actionType === "select"
                  ? "Provide feedback for selection"
                  : "Provide reason for rejection"}
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter your feedback here..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className={`px-4 py-2 text-white rounded-md ${
                  actionType === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantDetails

