"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"
import { FaCheck, FaTimes, FaEye } from "react-icons/fa"

const ManageVacancyRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [actionType, setActionType] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [viewDetails, setViewDetails] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vacancies/requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setRequests(response.data.requests)
        }
      } catch (error) {
        console.error("Error fetching vacancy requests:", error)
        setError("Failed to load vacancy requests. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleAction = (request, action) => {
    setCurrentRequest(request)
    setActionType(action)
    setFeedback("")
    setShowFeedbackModal(true)
  }

  const submitAction = async () => {
    if (!currentRequest || !actionType) return

    setProcessingId(currentRequest._id)

    try {
      const response = await axios.put(
        `http://localhost:5000/api/vacancies/requests/${currentRequest._id}`,
        {
          action: actionType,
          feedback: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        // Remove the processed request from the list
        setRequests(requests.filter((req) => req._id !== currentRequest._id))
        setShowFeedbackModal(false)
      }
    } catch (error) {
      console.error("Error processing vacancy request:", error)
      alert("Failed to process vacancy request. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  const handleViewDetails = (request) => {
    setViewDetails(request)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const columns = [
    {
      name: "Position",
      selector: (row) => row.position,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department?.dep_name || "Unknown",
      sortable: true,
    },
    {
      name: "Positions",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Salary",
      selector: (row) => formatCurrency(row.salary),
      sortable: true,
    },
    {
      name: "Date Requested",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleAction(row, "approve")}
            disabled={processingId === row._id}
            className="text-green-600 hover:text-green-800"
            title="Approve"
          >
            <FaCheck />
          </button>
          <button
            onClick={() => handleAction(row, "reject")}
            disabled={processingId === row._id}
            className="text-red-600 hover:text-red-800"
            title="Reject"
          >
            <FaTimes />
          </button>
          <button
            onClick={() => handleViewDetails(row)}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ]

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
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Vacancy Requests</h2>

      {requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No pending vacancy requests</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <DataTable columns={columns} data={requests} pagination highlightOnHover responsive />
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {actionType === "approve" ? "Approve Vacancy Request" : "Reject Vacancy Request"}
            </h3>
            <p className="mb-4">
              {actionType === "approve"
                ? "This vacancy will be posted publicly after approval."
                : "Please provide a reason for rejecting this vacancy request."}
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
                  actionType === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{viewDetails.position}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{viewDetails.department?.dep_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Positions</p>
                <p className="font-medium">{viewDetails.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Salary</p>
                <p className="font-medium">{formatCurrency(viewDetails.salary)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Required Education</p>
                <p className="font-medium">{viewDetails.eduLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Required Experience</p>
                <p className="font-medium">{viewDetails.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Application Deadline</p>
                <p className="font-medium">{new Date(viewDetails.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Job Description</p>
              <p className="mt-1">{viewDetails.description}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Justification</p>
              <p className="mt-1">{viewDetails.justification}</p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setViewDetails(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAction(viewDetails, "approve")
                  setViewDetails(null)
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleAction(viewDetails, "reject")
                  setViewDetails(null)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageVacancyRequests

