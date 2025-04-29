"use client"

import { useEffect, useState } from "react"
import SummaryCard from "./SummaryCard"
import {
  FaBuilding,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUserCheck,
  FaUsers,
  FaChartLine,
} from "react-icons/fa"
import axios from "axios"
import ChartComponent from "../charts/ChartComponent"

const AdminSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlyPayroll: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0,
  })
  const [departmentData, setDepartmentData] = useState([])
  const [leaveData, setLeaveData] = useState([])
  const [salaryTrend, setSalaryTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        // Fetch employees count
        const employeesResponse = await axios
          .get("http://localhost:5000/api/employees/count", { headers })
          .catch(() => ({ data: { count: 0 } }))

        // Fetch departments count - try both endpoints
        let totalDepartments = 0
        try {
          const departmentsCountResponse = await axios.get("http://localhost:5000/api/departments/count", { headers })
          if (departmentsCountResponse.data.success) {
            totalDepartments = departmentsCountResponse.data.count
          } else {
            throw new Error("Count endpoint returned unsuccessful response")
          }
        } catch (countError) {
          console.log("Trying fallback method for department count...")
          const departmentsResponse = await axios.get("http://localhost:5000/api/departments", { headers })
          if (departmentsResponse.data.success) {
            totalDepartments = departmentsResponse.data.departments?.length || 0

            // Create department data for chart
            const deptData = departmentsResponse.data.departments
              .map((dept) => ({
                name: dept.dep_name,
                employees: Math.floor(Math.random() * 30) + 5, // Mock data - in a real app, you'd fetch actual counts
              }))
              .slice(0, 6) // Limit to 6 departments for better visualization

            setDepartmentData(deptData)
          }
        }

        // Fetch monthly net salary total
        const payrollResponse = await axios
          .get("http://localhost:5000/api/salary/monthly-total", { headers })
          .catch((err) => {
            console.error("Error fetching monthly payroll:", err)
            return { data: { total: 0 } }
          })

        // Fetch leave statistics
        const leaveResponse = await axios.get("http://localhost:5000/api/leave/stats", { headers }).catch(() => ({
          data: {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          },
        }))

        // Create leave data for chart
        const leaveChartData = [
          { name: "Approved", value: leaveResponse.data.approved || 0 },
          { name: "Pending", value: leaveResponse.data.pending || 0 },
          { name: "Rejected", value: leaveResponse.data.rejected || 0 },
        ]
        setLeaveData(leaveChartData)

        // Create mock salary trend data (for the last 6 months)
        const currentMonth = new Date().getMonth()
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const salaryTrendData = []

        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          salaryTrendData.push({
            month: months[monthIndex],
            amount: Math.floor((payrollResponse.data.total || 50000) * (0.9 + Math.random() * 0.2)),
          })
        }
        setSalaryTrend(salaryTrendData)

        // Set the summary data
        setSummaryData({
          totalEmployees: employeesResponse.data.count || 0,
          totalDepartments,
          monthlyPayroll: payrollResponse.data.total || 0,
          leaveApplied: leaveResponse.data.total || 0,
          leaveApproved: leaveResponse.data.approved || 0,
          leavePending: leaveResponse.data.pending || 0,
          leaveRejected: leaveResponse.data.rejected || 0,
        })
      } catch (error) {
        console.error("Error fetching summary data:", error)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSummaryData()
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

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  // Format the monthly payroll amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      <div className="flex items-center mb-6">
        <FaChartLine className="text-primary-600 mr-2 text-xl" />
        <h3 className="text-xl md:text-2xl font-bold">Dashboard Overview</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employees"
          number={summaryData.totalEmployees}
          color="bg-primary-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summaryData.totalDepartments}
          color="bg-secondary-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Monthly Net Salary"
          number={formatCurrency(summaryData.monthlyPayroll)}
          color="bg-emerald-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-4">
          <ChartComponent
            type="bar"
            data={departmentData}
            xKey="name"
            yKey="employees"
            title="Employees by Department"
            height={300}
            colors={["#0d9488"]}
          />
        </div>

        <div className="card p-4">
          <ChartComponent
            type="line"
            data={salaryTrend}
            xKey="month"
            yKey="amount"
            title="Monthly Salary Trend"
            height={300}
            colors={["#0d9488"]}
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center">
          <FaFileAlt className="mr-2 text-primary-600" />
          Leave Statistics
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard
              icon={<FaFileAlt />}
              text="Leave Applied"
              number={summaryData.leaveApplied}
              color="bg-blue-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
            />
            <SummaryCard
              icon={<FaUserCheck />}
              text="Leave Approved"
              number={summaryData.leaveApproved}
              color="bg-green-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
            />
            <SummaryCard
              icon={<FaHourglassHalf />}
              text="Leave Pending"
              number={summaryData.leavePending}
              color="bg-amber-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
            />
            <SummaryCard
              icon={<FaTimesCircle />}
              text="Leave Rejected"
              number={summaryData.leaveRejected}
              color="bg-red-600 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
            />
          </div>

          <div className="card p-4">
            <ChartComponent
              type="pie"
              data={leaveData}
              xKey="name"
              yKey="value"
              title="Leave Status Distribution"
              height={300}
              colors={["#16a34a", "#f59e0b", "#dc2626"]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSummary
