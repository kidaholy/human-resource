"use client"

import { useEffect, useState } from "react"
import SummaryCard from "./SummaryCard"
import { FaCalendarCheck, FaCalendarTimes, FaInbox, FaUsers, FaChartBar, FaHistory } from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../../context/authContext"
import ChartComponent from "../charts/ChartComponent"
import DepartmentEmployeesLeaveHistory from "../leave/DepartmentEmployeesLeaveHistory"

const DepartmentHeadSummary = () => {
  const [summaryData, setSummaryData] = useState({
    departmentEmployees: 0,
    pendingLeaveRequests: 0,
    approvedLeaveRequests: 0,
    rejectedLeaveRequests: 0,
    recentLeaveRequests: [],
    departmentName: "",
  })
  const [leaveStatusData, setLeaveStatusData] = useState([])
  const [leaveTypeData, setLeaveTypeData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/leave/update-status/${leaveId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Update the local state to reflect the change
      setSummaryData((prev) => ({
        ...prev,
        recentLeaveRequests: prev.recentLeaveRequests.filter((request) => request._id !== leaveId),
        pendingLeaveRequests: prev.pendingLeaveRequests - 1,
        ...(status === "approved"
          ? { approvedLeaveRequests: prev.approvedLeaveRequests + 1 }
          : { rejectedLeaveRequests: prev.rejectedLeaveRequests + 1 }),
      }))

      // Update the leave status chart data
      setLeaveStatusData((prev) =>
        prev.map((item) => {
          if (item.name.toLowerCase() === "pending") {
            return { ...item, value: Math.max(0, item.value - 1) }
          }
          if (item.name.toLowerCase() === status) {
            return { ...item, value: item.value + 1 }
          }
          return item
        }),
      )
    } catch (error) {
      console.error("Error updating leave status:", error)
      alert("Failed to update leave status. Please try again.")
    }
  }

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true)

        // Fetch department employees count
        const employeesResponse = await axios.get("http://localhost:5000/api/employees/department-count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        // Fetch department leave requests
        const leaveResponse = await axios.get("http://localhost:5000/api/leave/department-requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        // Fetch department leave stats
        const leaveStatsResponse = await axios.get("http://localhost:5000/api/leave/department-stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        // Fetch department employees to get department name
        const departmentEmployeesResponse = await axios.get(
          "http://localhost:5000/api/employees/department-employees",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )

        // Create leave status chart data
        const leaveStatusChartData = [
          { name: "Approved", value: leaveStatsResponse.data.approved || 0 },
          { name: "Pending", value: leaveStatsResponse.data.pending || 0 },
          { name: "Rejected", value: leaveStatsResponse.data.rejected || 0 },
        ]
        setLeaveStatusData(leaveStatusChartData)

        // Create leave type chart data (mock data - in a real app, you'd aggregate from actual data)
        const leaveTypeChartData = [
          { name: "Annual", value: Math.floor(Math.random() * 15) + 5 },
          { name: "Sick", value: Math.floor(Math.random() * 10) + 2 },
          { name: "Maternity", value: Math.floor(Math.random() * 3) + 1 },
          { name: "Other", value: Math.floor(Math.random() * 5) + 1 },
        ]
        setLeaveTypeData(leaveTypeChartData)

        // Set the summary data
        setSummaryData({
          departmentEmployees: employeesResponse.data.count || 0,
          pendingLeaveRequests: leaveStatsResponse.data.pending || 0,
          approvedLeaveRequests: leaveStatsResponse.data.approved || 0,
          rejectedLeaveRequests: leaveStatsResponse.data.rejected || 0,
          recentLeaveRequests: leaveResponse.data.leaveRequests || [],
          departmentName: departmentEmployeesResponse.data.departmentName || "Your Department",
        })
      } catch (error) {
        console.error("Error fetching summary data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchSummaryData()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  // Filter for pending leave requests only for the table
  const pendingLeaveRequests = summaryData.recentLeaveRequests
    .filter((request) => request.departmentHeadStatus === "pending")
    .slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <FaChartBar className="text-primary-600 mr-2 text-xl" />
        <h3 className="text-xl md:text-2xl font-bold">Department Head Dashboard - {summaryData.departmentName}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={<FaUsers />}
          text="Department Employees"
          number={summaryData.departmentEmployees}
          color="bg-primary-600"
        />
        <SummaryCard
          icon={<FaInbox />}
          text="Pending Requests"
          number={summaryData.pendingLeaveRequests}
          color="bg-amber-600"
        />
        <SummaryCard
          icon={<FaCalendarCheck />}
          text="Approved Leaves"
          number={summaryData.approvedLeaveRequests}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaCalendarTimes />}
          text="Rejected Leaves"
          number={summaryData.rejectedLeaveRequests}
          color="bg-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-4">
          <ChartComponent
            type="pie"
            data={leaveStatusData}
            xKey="name"
            yKey="value"
            title="Leave Status Distribution"
            height={300}
            colors={["#16a34a", "#f59e0b", "#dc2626"]}
          />
        </div>

        <div className="card p-4">
          <ChartComponent
            type="bar"
            data={leaveTypeData}
            xKey="name"
            yKey="value"
            title="Leave Types"
            height={300}
            colors={["#0d9488"]}
          />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center">
          <FaInbox className="mr-2 text-primary-600" />
          Recent Leave Requests
        </h4>

        {pendingLeaveRequests.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-gray-500">No pending leave requests</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingLeaveRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {request.employeeId?.userId?.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:5000/${request.employeeId.userId.profileImage}`}
                                alt=""
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xl text-gray-500">
                                  {request.employeeId?.userId?.name?.[0] || "?"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.employeeId?.userId?.name}
                            </div>
                            <div className="text-sm text-gray-500">{request.employeeId?.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{request.leaveType.replace(/_/g, " ")}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{request.totalDays} days</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleLeaveAction(request._id, "approved")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveAction(request._id, "rejected")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center">
          <FaHistory className="mr-2 text-primary-600" />
          Department Leave History
        </h4>
        <DepartmentEmployeesLeaveHistory />
      </div>
    </div>
  )
}

export default DepartmentHeadSummary

