"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/authContext"

const RequestLeave = () => {
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [leaveBalance, setLeaveBalance] = useState({
    annual: 30,
    sick: 15,
    other: 5,
  })
  const [totalDays, setTotalDays] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Calculate leave balance from leave history
    const fetchLeaveBalance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          const leaveHistory = response.data.leaveHistory

          // Calculate used leave days by type
          const usedLeave = {
            annual: 0,
            sick: 0,
            other: 0,
          }

          leaveHistory.forEach((leave) => {
            if (leave.status === "approved") {
              const startDate = new Date(leave.startDate)
              const endDate = new Date(leave.endDate)
              const diffTime = Math.abs(endDate - startDate)
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

              if (leave.leaveType === "annual") {
                usedLeave.annual += diffDays
              } else if (leave.leaveType === "sick") {
                usedLeave.sick += diffDays
              } else {
                usedLeave.other += diffDays
              }
            }
          })

          // Update leave balance
          setLeaveBalance({
            annual: 30 - usedLeave.annual,
            sick: 15 - usedLeave.sick,
            other: 5 - usedLeave.other,
          })
        }
      } catch (error) {
        console.error("Error fetching leave balance:", error)
      }
    }

    fetchLeaveBalance()
  }, [])

  useEffect(() => {
    // Calculate total days when dates change
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate)
      const end = new Date(leaveData.endDate)

      if (start && end) {
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days
        setTotalDays(diffDays)
      }
    } else {
      setTotalDays(0)
    }
  }, [leaveData.startDate, leaveData.endDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLeaveData({ ...leaveData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate dates
    const start = new Date(leaveData.startDate)
    const end = new Date(leaveData.endDate)
    const today = new Date()

    if (start < today) {
      setError("Start date cannot be in the past")
      setLoading(false)
      return
    }

    if (end < start) {
      setError("End date cannot be before start date")
      setLoading(false)
      return
    }

    // Validate leave balance
    if (leaveData.leaveType === "annual" && totalDays > leaveBalance.annual) {
      setError(`You don't have enough annual leave balance. Available: ${leaveBalance.annual} days`)
      setLoading(false)
      return
    }

    if (leaveData.leaveType === "sick" && totalDays > leaveBalance.sick) {
      setError(`You don't have enough sick leave balance. Available: ${leaveBalance.sick} days`)
      setLoading(false)
      return
    }

    if (
      ["maternity", "paternity", "bereavement", "other"].includes(leaveData.leaveType) &&
      totalDays > leaveBalance.other
    ) {
      setError(`You don't have enough other leave balance. Available: ${leaveBalance.other} days`)
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("http://localhost:5000/api/leave/request", leaveData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        navigate("/employee-dashboard/leave-history")
      }
    } catch (error) {
      console.error("Error requesting leave:", error)
      setError(error.response?.data?.error || "An error occurred while requesting leave")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request Leave</h2>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-700">Annual Leave</p>
          <p className="text-2xl font-bold text-teal-800">{leaveBalance.annual} days</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">Sick Leave</p>
          <p className="text-2xl font-bold text-blue-800">{leaveBalance.sick} days</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700">Other Leave</p>
          <p className="text-2xl font-bold text-purple-800">{leaveBalance.other} days</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={leaveData.startDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={leaveData.endDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={leaveData.leaveType}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Leave Type</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="bereavement">Bereavement Leave</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="totalDays" className="block text-sm font-medium text-gray-700">
              Total Days
            </label>
            <input
              type="text"
              id="totalDays"
              value={totalDays}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={leaveData.reason}
              onChange={handleChange}
              rows="4"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  )
}

export default RequestLeave

