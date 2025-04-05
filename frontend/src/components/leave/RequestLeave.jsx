"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const RequestLeave = () => {
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLeaveData({ ...leaveData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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

