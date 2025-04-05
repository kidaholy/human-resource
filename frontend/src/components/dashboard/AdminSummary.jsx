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

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch employees count
        const employeesResponse = await axios
          .get("http://localhost:5000/api/employees/count", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({ data: { count: 0 } }))

        // Fetch departments count
        const departmentsResponse = await axios
          .get("http://localhost:5000/api/departments/count", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({ data: { count: 0 } }))

        // Fetch monthly payroll
        const payrollResponse = await axios
          .get("http://localhost:5000/api/salary/monthly-total", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .catch(() => ({ data: { total: 0 } }))

        // Fetch leave statistics
        const leaveResponse = await axios
          .get("http://localhost:5000/api/leave/stats", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
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
          totalDepartments: departmentsResponse.data.count || 0,
          monthlyPayroll: payrollResponse.data.total || 0,
          leaveApplied: leaveResponse.data.total || 0,
          leaveApproved: leaveResponse.data.approved || 0,
          leavePending: leaveResponse.data.pending || 0,
          leaveRejected: leaveResponse.data.rejected || 0,
        })
      } catch (error) {
        console.error("Error fetching summary data:", error)
        // If API endpoints don't exist yet, fetch actual data from existing endpoints
        try {
          // Fallback: Get actual employee count from the employees list
          const employeesResponse = await axios.get("http://localhost:5000/api/employees", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })

          // Fallback: Get actual department count from the departments list
          const departmentsResponse = await axios.get("http://localhost:5000/api/departments", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })

          // Calculate total employees and departments
          const totalEmployees = employeesResponse.data.employees?.length || 0
          const totalDepartments = departmentsResponse.data.departments?.length || 0

          // Set the summary data with fallback values
          setSummaryData({
            totalEmployees,
            totalDepartments,
            monthlyPayroll: 0, // No easy way to calculate this without specific endpoint
            leaveApplied: 0,
            leaveApproved: 0,
            leavePending: 0,
            leaveRejected: 0,
          })
        } catch (fallbackError) {
          console.error("Error in fallback data fetching:", fallbackError)
        }
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
          text="Total Department"
          number={summaryData.totalDepartments}
          color="bg-yellow-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Monthly Pay"
          number={`$${summaryData.monthlyPayroll.toLocaleString()}`}
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

