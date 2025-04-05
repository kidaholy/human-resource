"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"
import { useAuth } from "../../context/authContext"

const DepartmentHeadLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [comment, setComment] = useState("")
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  const [actionType, setActionType] = useState(null)
  const { user } = useAuth()

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/leave/department-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        setLeaveRequests(response.data.leaveRequests)
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error)
      setError("Failed to fetch leave requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  const handleAction = (request, action) => {
    setCurrentRequest(request)
    setActionType(action)
    setShowCommentModal(true)
  }

  const submitAction = async () => {
    if (!currentRequest || !actionType) return

    try {
      setProcessingId(currentRequest._id)
      const response = await axios.put(
        `http://localhost:5000/api/leave/department-head/${currentRequest._id}`,
        {
          status: actionType,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        // Remove the processed request from the list
        setLeaveRequests(leaveRequests.filter((req) => req._id !== currentRequest._id))
        setShowCommentModal(false)
        setComment("")
      }
    } catch (error) {
      console.error("Error processing leave request:", error)
      alert("Failed to process leave request")
    } finally {
      setProcessingId(null)
    }
  }

  const columns = [
    {
      name: "Employee",
      selector: (row) => row.employeeId?.userId?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
      cell: (row) => <span className="capitalize">{row.leaveType.replace("_", " ")}</span>,
    },
    {
      name: "Duration",
      selector: (row) => `${row.totalDays} days`,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: false,
      cell: (row) => (
        <div className="max-w-xs truncate" title={row.reason}>
          {row.reason}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleAction(row, "approved")}
            disabled={processingId === row._id}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction(row, "rejected")}
            disabled={processingId === row._id}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      ),
    },
  ]

  if (loading) return <div className="p-4">Loading leave requests...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Department Leave Requests</h2>

      {leaveRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No pending leave requests to review</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={columns}
            data={leaveRequests}
            pagination
            highlightOnHover
            responsive
            noDataComponent="No leave requests found"
          />
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{actionType === "approved" ? "Approve" : "Reject"} Leave Request</h3>
            <p className="mb-4">
              {actionType === "approved"
                ? "Please provide any comments for approving this leave request:"
                : "Please provide a reason for rejecting this leave request:"}
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter your comments here..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCommentModal(false)
                  setComment("")
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className={`px-4 py-2 text-white rounded-md ${
                  actionType === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
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

export default DepartmentHeadLeaveManagement

