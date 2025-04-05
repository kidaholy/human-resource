"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"
import { useAuth } from "../../context/authContext"

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDepartmentHead, setIsDepartmentHead] = useState(false)
  const { user } = useAuth()

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
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
      cell: (row) => <span className="capitalize">{row.leaveType.replace("_", " ")}</span>,
    },
    {
      name: "Duration",
      selector: (row) => row.totalDays,
      sortable: true,
      cell: (row) => `${row.totalDays} day${row.totalDays > 1 ? 's' : ''}`,
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
      name: "Department",
      selector: (row) => row.employeeId?.department?.dep_name,
      sortable: true,
      omit: !isDepartmentHead,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => getStatusBadge(row),
    },
    {
      name: "Comments",
      grow: 2,
      cell: (row) => (
        <div className="py-2">
          {row.departmentHeadComment && (
            <div className="text-xs mb-1">
              <span className="font-semibold text-blue-600">Dept Head:</span> {row.departmentHeadComment}
            </div>
          )}
          {row.adminComment && (
            <div className="text-xs">
              <span className="font-semibold text-purple-600">Admin:</span> {row.adminComment}
            </div>
          )}
          {!row.departmentHeadComment && !row.adminComment && (
            <span className="text-xs text-gray-500">No comments</span>
          )}
        </div>
      ),
    },
  ]

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setLeaves(response.data.leaveHistory)
          setIsDepartmentHead(response.data.isDepartmentHead)
        }
      } catch (error) {
        console.error("Error fetching leave history:", error)
        setError("Failed to fetch leave history")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveHistory()
  }, [])

  if (loading) return <div className="p-4">Loading leave history...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leave History</h2>
        {isDepartmentHead && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Department Head View
          </span>
        )}
      </div>

      {leaves.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No leave history found</p>
          <button
            onClick={() => (window.location.href = "/employee-dashboard/request-leave")}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Request Leave
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable
            columns={columns}
            data={leaves}
            pagination
            highlightOnHover
            responsive
            noDataComponent="No leave records found"
            defaultSortFieldId={3}
            defaultSortAsc={false}
          />
        </div>
      )}
    </div>
  )
}

export default LeaveHistory

