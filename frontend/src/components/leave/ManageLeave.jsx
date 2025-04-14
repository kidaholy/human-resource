"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"
import { FaFilter } from "react-icons/fa"

const ManageLeave = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [filterType, setFilterType] = useState("all")
  const [processingId, setProcessingId] = useState(null)
  const [comment, setComment] = useState("")
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [currentRequest, setCurrentRequest] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    departmentHeadPending: 0,
    adminPending: 0,
  })

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)

      // Fetch all leave requests
      const response = await axios.get("http://localhost:5000/api/leave/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Fetch leave statistics
      const statsResponse = await axios.get("http://localhost:5000/api/leave/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        const leaveData = response.data.leaveRequests
        setLeaves(leaveData)
        applyFilter(leaveData, filterType)
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data)
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

  const applyFilter = (data, type) => {
    let filtered = [...data]

    switch (type) {
      case "pending_admin":
        filtered = data.filter((leave) => leave.departmentHeadStatus === "approved" && leave.adminStatus === "pending")
        break
      case "pending_department":
        filtered = data.filter((leave) => leave.departmentHeadStatus === "pending")
        break
      case "approved":
        filtered = data.filter((leave) => leave.status === "approved")
        break
      case "rejected":
        filtered = data.filter((leave) => leave.status === "rejected")
        break
      case "all":
      default:
        // No filtering needed
        break
    }

    setFilteredLeaves(filtered)
    setFilterType(type)
  }

  const handleAction = (request, action) => {
    // Check if department head has approved
    if (request.departmentHeadStatus !== "approved") {
      alert("Department head must approve this request before admin can process it.")
      return
    }

    setCurrentRequest(request)
    setActionType(action)
    setShowCommentModal(true)
  }

  const submitAction = async () => {
    if (!currentRequest || !actionType) return

    try {
      setProcessingId(currentRequest._id)
      const response = await axios.put(
        `http://localhost:5000/api/leave/admin/${currentRequest._id}`,
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
        // Refresh the data
        fetchLeaveRequests()
        setShowCommentModal(false)
        setComment("")
      }
    } catch (error) {
      console.error("Error processing leave request:", error)
      alert(error.response?.data?.error || "Failed to process leave request")
    } finally {
      setProcessingId(null)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    const filtered = leaves.filter(
      (leave) =>
        (leave.employeeId?.userId?.name || "").toLowerCase().includes(value) ||
        leave.leaveType.toLowerCase().includes(value) ||
        leave.status.toLowerCase().includes(value),
    )
    setFilteredLeaves(filtered)
  }

  const getStatusBadge = (leave) => {
    // Department head status
    if (leave.departmentHeadStatus === "pending") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending Department Head
        </span>
      )
    }

    if (leave.departmentHeadStatus === "rejected") {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected by Department Head
        </span>
      )
    }

    // Admin status (only if department head approved)
    if (leave.departmentHeadStatus === "approved") {
      if (leave.adminStatus === "pending") {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Pending Admin</span>
        )
      }

      if (leave.adminStatus === "approved") {
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>
      }

      if (leave.adminStatus === "rejected") {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected by Admin</span>
        )
      }
    }

    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>
  }

  const columns = [
    {
      name: "Employee",
      selector: (row) => row.employeeId?.userId?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.employeeId?.department?.dep_name || "Unknown",
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
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => getStatusBadge(row),
    },
    {
      name: "Medical Certificate",
      selector: (row) => (row.leaveType === "sick" ? (row.medicalCertificate ? "Yes" : "No") : "N/A"),
      sortable: true,
      cell: (row) => {
        if (row.leaveType !== "sick") return <span className="text-gray-400">N/A</span>

        if (row.medicalCertificate) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Provided</span>
          )
        } else if (row.requiresMedicalCertificate) {
          return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Required</span>
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Required</span>
          )
        }
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          {row.departmentHeadStatus === "approved" && row.adminStatus === "pending" && (
            <>
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
            </>
          )}
          {(row.adminStatus === "approved" ||
            row.adminStatus === "rejected" ||
            row.departmentHeadStatus === "rejected") && <span className="text-gray-500">Processed</span>}
          {row.departmentHeadStatus === "pending" && <span className="text-yellow-500">Awaiting Department Head</span>}
        </div>
      ),
    },
  ]

  if (loading) return <div className="p-4">Loading leave requests...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Leave Requests</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Dept. Head</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.departmentHeadPending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending Admin</p>
          <p className="text-2xl font-bold text-blue-600">{stats.adminPending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={filterType}
            onChange={(e) => applyFilter(leaves, e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending_admin">Pending Admin Approval</option>
            <option value="pending_department">Pending Department Head</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by employee or leave type"
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredLeaves}
          pagination
          highlightOnHover
          responsive
          noDataComponent="No leave requests found"
        />
      </div>

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

export default ManageLeave
