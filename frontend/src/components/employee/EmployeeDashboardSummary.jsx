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
  FaBell,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa"
import axios from "axios"
import { useAuth } from "../../context/authContext"
import ChartComponent from "../charts/ChartComponent"
import { FaCalendarAlt } from "react-icons/fa"

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
  const [upcomingEvents, setUpcomingEvents] = useState([])
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

        // Mock upcoming events
        const mockEvents = [
          {
            id: 1,
            title: "Department Meeting",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            type: "meeting",
          },
          {
            id: 2,
            title: "Salary Payment",
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            type: "payment",
          },
          {
            id: 3,
            title: "Annual Performance Review",
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            type: "review",
          },
        ]
        setUpcomingEvents(mockEvents)

        // Mock notifications
        const mockNotifications = [
          {
            id: 1,
            title: "Leave Approved",
            message: "Your leave request for next week has been approved by the department head.",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: "success",
            isRead: false,
          },
          {
            id: 2,
            title: "Salary Processed",
            message: "Your salary for this month has been processed and will be deposited soon.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            type: "info",
            isRead: true,
          },
          {
            id: 3,
            title: "Document Reminder",
            message: "Please submit your updated CV for the annual records update.",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            type: "warning",
            isRead: true,
          },
        ]

        // Set dashboard data
        setDashboardData({
          workingDays: 22, // This could be calculated based on current month
          currentSalary: employeeData.salary || 45000,
          leaveBalance,
          approvedLeaves,
          rejectedLeaves,
          notifications: mockNotifications,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)

        // Set mock data for demonstration
        const mockLeaveBalance = 24
        const mockApprovedLeaves = 6

        // Create mock leave balance chart data
        const mockLeaveBalanceData = [
          { name: "Used", value: mockApprovedLeaves },
          { name: "Available", value: mockLeaveBalance },
        ]
        setLeaveBalanceData(mockLeaveBalanceData)

        // Create mock leave history chart data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentMonth = new Date().getMonth()

        const mockLeaveHistoryData = []
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          mockLeaveHistoryData.push({
            month: months[monthIndex],
            leaves: Math.floor(Math.random() * 3),
          })
        }
        setLeaveHistoryData(mockLeaveHistoryData)

        // Mock upcoming events
        const mockEvents = [
          {
            id: 1,
            title: "Department Meeting",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            type: "meeting",
          },
          {
            id: 2,
            title: "Salary Payment",
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            type: "payment",
          },
          {
            id: 3,
            title: "Annual Performance Review",
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            type: "review",
          },
        ]
        setUpcomingEvents(mockEvents)

        // Mock notifications
        const mockNotifications = [
          {
            id: 1,
            title: "Leave Approved",
            message: "Your leave request for next week has been approved by the department head.",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: "success",
            isRead: false,
          },
          {
            id: 2,
            title: "Salary Processed",
            message: "Your salary for this month has been processed and will be deposited soon.",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            type: "info",
            isRead: true,
          },
          {
            id: 3,
            title: "Document Reminder",
            message: "Please submit your updated CV for the annual records update.",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            type: "warning",
            isRead: true,
          },
        ]

        setDashboardData({
          workingDays: 22,
          currentSalary: 45000,
          leaveBalance: mockLeaveBalance,
          approvedLeaves: mockApprovedLeaves,
          rejectedLeaves: 2,
          notifications: mockNotifications,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "meeting":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FaClipboardList />
          </div>
        )
      case "payment":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <FaMoneyBillWave />
          </div>
        )
      case "review":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <FaFileAlt />
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <FaCalendarCheck />
          </div>
        )
    }
  }

  const getNotificationBorder = (type) => {
    switch (type) {
      case "success":
        return "border-green-500"
      case "warning":
        return "border-amber-500"
      case "error":
        return "border-red-500"
      default:
        return "border-primary-500"
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl shadow-sm"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl shadow-sm"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl shadow-sm"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartPie className="text-primary-600 mr-2" />
            Employee Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back, {user?.name || "Employee"}! Here's your overview.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            <FaCalendarCheck className="mr-1" />{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          icon={<FaUserClock />}
          text="Working Days This Month"
          number={dashboardData.workingDays}
          color="bg-primary-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Current Salary"
          number={`${dashboardData.currentSalary.toLocaleString()} ETB`}
          color="bg-emerald-600"
        />
        <SummaryCard
          icon={<FaCalendarWeek />}
          text="Annual Leave Balance"
          number={dashboardData.leaveBalance}
          color="bg-blue-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <FaChartPie className="text-primary-600 mr-2" />
              Annual Leave Balance
            </h3>
          </div>
          <div className="p-6">
            <ChartComponent
              type="pie"
              data={{
                labels: ["Used", "Available"],
                datasets: [
                  {
                    data: leaveBalanceData.map((item) => item.value),
                    backgroundColor: ["rgba(245, 158, 11, 0.8)", "rgba(13, 148, 136, 0.8)"],
                    borderColor: ["rgba(245, 158, 11, 1)", "rgba(13, 148, 136, 1)"],
                    borderWidth: 1,
                  },
                ],
              }}
              height={300}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <FaCalendarCheck className="text-primary-600 mr-2" />
              Leave History (Last 6 Months)
            </h3>
          </div>
          <div className="p-6">
            <ChartComponent
              type="bar"
              data={{
                labels: leaveHistoryData.map((item) => item.month),
                datasets: [
                  {
                    label: "Leaves Taken",
                    data: leaveHistoryData.map((item) => item.leaves),
                    backgroundColor: "rgba(13, 148, 136, 0.8)",
                    borderColor: "rgba(13, 148, 136, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Leave Status and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <FaCalendarCheck className="text-primary-600 mr-2" />
              Leave Status
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <FaCalendarCheck />
                  </div>
                  <div>
                    <p className="text-sm text-green-800 font-medium">Approved Leaves</p>
                    <p className="text-2xl font-bold text-green-900">{dashboardData.approvedLeaves}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                    <FaCalendarTimes />
                  </div>
                  <div>
                    <p className="text-sm text-red-800 font-medium">Rejected Leaves</p>
                    <p className="text-2xl font-bold text-red-900">{dashboardData.rejectedLeaves}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full py-2 px-4 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors flex items-center justify-center">
                <FaCalendarWeek className="mr-2" /> Request New Leave
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <FaCalendarAlt className="text-primary-600 mr-2" />
              Upcoming Events
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  {getEventIcon(event.type)}
                  <div className="ml-4">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                <FaCalendarAlt className="mr-2" /> View Full Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <FaBell className="text-primary-600 mr-2" />
            Recent Notifications
          </h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Mark All as Read</button>
        </div>
        <div className="p-6">
          {dashboardData.notifications.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 ${getNotificationBorder(notification.type)} pl-4 py-3 pr-3 rounded-r-lg ${notification.isRead ? "bg-white" : "bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    {!notification.isRead && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FaBell className="mx-auto text-4xl text-gray-300 mb-2" />
              <p>No recent notifications</p>
            </div>
          )}
          <div className="mt-6 text-center">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboardSummary
