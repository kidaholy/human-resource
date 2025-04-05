"use client"

import { useEffect, useState } from "react"
import SummaryCard from "./SummaryCard"
import { FaCalendarCheck, FaCalendarTimes, FaInbox, FaUsers } from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const DepartmentHeadSummary = () => {
  const [summaryData, setSummaryData] = useState({
    departmentEmployees: 0,
    pendingLeaveRequests: 0,
    approvedLeaveRequests: 0,
    rejectedLeaveRequests: 0,
    recentLeaveRequests: [],
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch department employees count
        const employeesResponse = await axios
          .get("http://localhost:5000/api/employees/department-count", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({ data: { count: 0 } }))

        // Fetch department leave requests
        const leaveResponse = await axios
          .get("http://localhost:5000/api/leave/department-requests", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({ data: { leaveRequests: [] } }))

        // Fetch department leave stats
        const leaveStatsResponse = await axios
          .get("http://localhost:5000/api/leave/department-stats", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({
            data: {
              pending: 0,
              approved: 0,
              rejected: 0,
            },
          }))

        // Set the summary data
        setSummaryData({
          departmentEmployees: employeesResponse.data.count || 0,
          pendingLeaveRequests: leaveStatsResponse.data.pending || 0,
          approvedLeaveRequests: leaveStatsResponse.data.approved || 0,
          rejectedLeaveRequests: leaveStatsResponse.data.rejected || 0,
          recentLeaveRequests: leaveResponse.data.leaveRequests || [],
        })
      } catch (error) {
        console.error("Error fetching summary data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummaryData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading summary data...</div>
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Department Head Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Department Employees"
          number={summaryData.departmentEmployees}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaInbox />}
          text="Pending Requests"
          number={summaryData.pendingLeaveRequests}
          color="bg-yellow-600"
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

      <div className="mt-12">
        <h4 className="text-xl font-bold mb-4">Recent Leave Requests</h4>

        {summaryData.recentLeaveRequests.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No pending leave requests</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData.recentLeaveRequests.slice(0, 5).map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`http://localhost:5000/${request.employeeId?.userId?.profileImage}`}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.employeeId?.userId?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{request.leaveType.replace("_", " ")}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.totalDays} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="/department-head-dashboard/leave-requests" className="text-teal-600 hover:text-teal-900">
                        Review
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DepartmentHeadSummary

