"use client"

import { useEffect, useState } from "react"
import SummaryCard from "../dashboard/SummaryCard"
import { FaCalendarCheck, FaCalendarTimes, FaCalendarWeek, FaMoneyBillWave, FaUserClock } from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const EmployeeDashboardSummary = () => {
  const [dashboardData, setDashboardData] = useState({
    workingDays: 0,
    currentSalary: 0,
    leaveBalance: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    notifications: [],
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch employee profile data
        const profileResponse = await axios.get("http://localhost:5000/api/employees/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        // Fetch leave data
        const leaveResponse = await axios.get("http://localhost:5000/api/leave/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        // Fetch notifications (if you have this endpoint)
        const notificationsResponse = await axios
          .get("http://localhost:5000/api/notifications", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({ data: { notifications: [] } })) // Fallback if endpoint doesn't exist

        // Process the data
        const employeeData = profileResponse.data.employee || {}
        const leaveData = leaveResponse.data.leaveHistory || []

        // Calculate leave statistics
        const approvedLeaves = leaveData.filter((leave) => leave.status === "approved").length
        const rejectedLeaves = leaveData.filter((leave) => leave.status === "rejected").length

        // Set dashboard data
        setDashboardData({
          workingDays: 22, // This could be calculated based on current month
          currentSalary: employeeData.salary || 0,
          leaveBalance: 30 - approvedLeaves, // Assuming 30 days annual leave
          approvedLeaves,
          rejectedLeaves,
          notifications: notificationsResponse.data.notifications || [],
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Employee Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUserClock />}
          text="Working Days"
          number={dashboardData.workingDays}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Current Salary"
          number={`$${dashboardData.currentSalary.toLocaleString()}`}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaCalendarWeek />}
          text="Leave Balance"
          number={dashboardData.leaveBalance}
          color="bg-blue-600"
        />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Status</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaCalendarCheck />}
            text="Approved Leaves"
            number={dashboardData.approvedLeaves}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaCalendarTimes />}
            text="Rejected Leaves"
            number={dashboardData.rejectedLeaves}
            color="bg-red-600"
          />
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        <h4 className="text-xl font-bold mb-4">Recent Notifications</h4>
        {dashboardData.notifications.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.notifications.map((notification, index) => (
              <div key={index} className={`border-l-4 border-${notification.type || "teal"}-500 pl-4 py-2`}>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">No recent notifications</div>
        )}
      </div>
    </div>
  )
}

export default EmployeeDashboardSummary

