"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"

const ManageLeave = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredLeaves, setFilteredLeaves] = useState([])

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        // Update the local state to reflect the change
        const updatedLeaves = leaves.map((leave) => (leave.id === id ? { ...leave, status } : leave))
        setLeaves(updatedLeaves)
        setFilteredLeaves(updatedLeaves)
      }
    } catch (error) {
      console.error("Error updating leave status:", error)
      alert("Failed to update leave status")
    }
  }

  const columns = [
    {
      name: "Employee",
      selector: (row) => row.employeeName,
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
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
    {
      name: "Actions",
      cell: (row) =>
        row.status === "pending" ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange(row.id, "approved")}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange(row.id, "rejected")}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-gray-500">Processed</span>
        ),
    },
  ]

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          // Mock data for demonstration
          const mockData = [
            {
              id: 1,
              employeeId: "EMP001",
              employeeName: "John Doe",
              startDate: "2023-05-10",
              endDate: "2023-05-15",
              leaveType: "Annual Leave",
              reason: "Family vacation",
              status: "approved",
            },
            {
              id: 2,
              employeeId: "EMP002",
              employeeName: "Jane Smith",
              startDate: "2023-06-20",
              endDate: "2023-06-22",
              leaveType: "Sick Leave",
              reason: "Fever",
              status: "approved",
            },
            {
              id: 3,
              employeeId: "EMP003",
              employeeName: "Michael Johnson",
              startDate: "2023-07-05",
              endDate: "2023-07-06",
              leaveType: "Other",
              reason: "Personal reasons",
              status: "rejected",
            },
            {
              id: 4,
              employeeId: "EMP004",
              employeeName: "Emily Williams",
              startDate: "2023-08-15",
              endDate: "2023-08-16",
              leaveType: "Bereavement Leave",
              reason: "Family emergency",
              status: "pending",
            },
            {
              id: 5,
              employeeId: "EMP005",
              employeeName: "David Brown",
              startDate: "2023-09-01",
              endDate: "2023-09-05",
              leaveType: "Annual Leave",
              reason: "Vacation",
              status: "pending",
            },
          ]
          setLeaves(mockData)
          setFilteredLeaves(mockData)
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error)
        setError("Failed to fetch leave requests")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveRequests()
  }, [])

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase()
    const filtered = leaves.filter(
      (leave) =>
        leave.employeeName.toLowerCase().includes(value) ||
        leave.leaveType.toLowerCase().includes(value) ||
        leave.status.toLowerCase().includes(value),
    )
    setFilteredLeaves(filtered)
  }

  if (loading) return <div className="p-4">Loading leave requests...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Leave Requests</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by employee, leave type, or status"
          className="px-4 py-2 border rounded-md w-full md:w-1/3"
          onChange={handleFilter}
        />
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
    </div>
  )
}

export default ManageLeave

