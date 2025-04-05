"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"
import { useAuth } from "../../context/authContext"

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const columns = [
    {
      name: "Leave ID",
      selector: (row) => row.leaveId,
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
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "approved"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
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
          // Mock data for demonstration
          const mockData = [
            {
              id: 1,
              leaveId: "LV001",
              startDate: "2023-05-10",
              endDate: "2023-05-15",
              leaveType: "Annual Leave",
              reason: "Family vacation",
              status: "approved",
            },
            {
              id: 2,
              leaveId: "LV002",
              startDate: "2023-06-20",
              endDate: "2023-06-22",
              leaveType: "Sick Leave",
              reason: "Fever",
              status: "approved",
            },
            {
              id: 3,
              leaveId: "LV003",
              startDate: "2023-07-05",
              endDate: "2023-07-06",
              leaveType: "Other",
              reason: "Personal reasons",
              status: "rejected",
            },
            {
              id: 4,
              leaveId: "LV004",
              startDate: "2023-08-15",
              endDate: "2023-08-16",
              leaveType: "Bereavement Leave",
              reason: "Family emergency",
              status: "pending",
            },
          ]
          setLeaves(mockData)
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
      <h2 className="text-2xl font-bold mb-6">Leave History</h2>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={leaves}
          pagination
          highlightOnHover
          responsive
          noDataComponent="No leave records found"
        />
      </div>
    </div>
  )
}

export default LeaveHistory

