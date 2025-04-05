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
} from "react-icons/fa"
import axios from "axios"

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
        const leaveResponse = await axios
          .get("http://localhost:5000/api/leave/stats", { headers })
          .catch(() => ({
            data: {
              total: 0,
              approved: 0,
              pending: 0,
              rejected: 0,
            },
          }))

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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  // Format the monthly payroll amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employees"
          number={summaryData.totalEmployees}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summaryData.totalDepartments}
          color="bg-yellow-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Monthly Net Salary"
          number={formatCurrency(summaryData.monthlyPayroll)}
          color="bg-green-600"
        />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={summaryData.leaveApplied}
            color="bg-teal-600"
          />
          <SummaryCard
            icon={<FaUserCheck />}
            text="Leave Approved"
            number={summaryData.leaveApproved}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summaryData.leavePending}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summaryData.leaveRejected}
            color="bg-red-600"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminSummary

