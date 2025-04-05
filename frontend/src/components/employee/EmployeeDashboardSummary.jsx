"use client"

import { useEffect, useState } from "react"
import SummaryCard from "../dashboard/SummaryCard"
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarWeek,
  FaMoneyBillWave,
  FaUserClock,
  FaChartPie,
} from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../../context/authContext"
import ChartComponent from "../charts/ChartComponent"

const EmployeeDashboardSummary = () => {
  const [dashboardData, setDashboardData] = useState({
    workingDays: 0,
    currentSalary: 0,
    leaveBalance: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    notifications: [],
  })
  const [leaveBalanceData, setLeaveBalanceData] = useState([])
  const [leaveHistoryData, setLeaveHistoryData] = useState([])
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
        const leaveBalance = 30 - approvedLeaves // Assuming 30 days annual leave

        // Create leave balance chart data
        const leaveBalanceChartData = [
          { name: "Used", value: approvedLeaves },
          { name: "Available", value: leaveBalance },
        ]
        setLeaveBalanceData(leaveBalanceChartData)

        // Create leave history chart data (last 6 months)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentMonth = new Date().getMonth()

        const leaveHistoryChartData = []
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          // In a real app, you'd filter leaves by month and count them
          // Here we're using mock data
          leaveHistoryChartData.push({
            month: months[monthIndex],
            leaves: Math.floor(Math.random() * 3),
          })
        }
        setLeaveHistoryData(leaveHistoryChartData)

        // Set dashboard data
        setDashboardData({
          workingDays: 22, // This could be calculated based on current month
          currentSalary: employeeData.salary || 0,
          leaveBalance,
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
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <FaChartPie className="text-primary-600 mr-2 text-xl" />
        <h3 className="text-xl md:text-2xl font-bold">Employee Dashboard</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          icon={<FaUserClock />}
          text="Working Days"
          number={dashboardData.workingDays}
          color="bg-primary-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Current Salary"
          number={`$${dashboardData.currentSalary.toLocaleString()}`}
          color="bg-emerald-600"
        />
        <SummaryCard
          icon={<FaCalendarWeek />}
          text="Leave Balance"
          number={dashboardData.leaveBalance}
          color="bg-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-4">
          <ChartComponent
            type="pie"
            data={leaveBalanceData}
            xKey="name"
            yKey="value"
            title="Annual Leave Balance"
            height={300}
            colors={["#f59e0b", "#0d9488"]}
          />
        </div>

        <div className="card p-4">
          <ChartComponent
            type="bar"
            data={leaveHistoryData}
            xKey="month"
            yKey="leaves"
            title="Leave History (Last 6 Months)"
            height={300}
            colors={["#0d9488"]}
          />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center">
          <FaCalendarCheck className="mr-2 text-primary-600" />
          Leave Status
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      <div className="mt-8 card p-6">
        <h4 className="text-lg md:text-xl font-bold mb-4">Recent Notifications</h4>
        {dashboardData.notifications.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.notifications.map((notification, index) => (
              <div key={index} className={`border-l-4 border-${notification.type || "primary"}-500 pl-4 py-2`}>
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

