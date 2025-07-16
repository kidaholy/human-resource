"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaCalendarAlt, FaUserClock, FaHistory, FaChartBar, FaMapMarkerAlt, FaRegStickyNote } from "react-icons/fa"
import { useAuth } from "../../context/authContext"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const EmployeeAttendance = () => {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [todayStatus, setTodayStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState(new Date())
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    totalHours: 0,
  })
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLocationOptions, setShowLocationOptions] = useState(false)
  const [locationOptions] = useState(["Office", "Remote", "Field Work", "Client Site", "Other"])

  useEffect(() => {
    fetchEmployeeData()

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [user])

  useEffect(() => {
    if (employee) {
      fetchAttendanceData()
      fetchTodayStatus()
      fetchAttendanceStats()
    }
  }, [employee, startDate, endDate])

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/api/employees/user/${user.id}`)
      setEmployee(response.data)
    } catch (error) {
      console.error("Error fetching employee data:", error)
      toast.error("Failed to fetch employee data")
    }
  }

  const fetchAttendanceData = async () => {
    if (!employee) return

    try {
      setLoading(true)
      const response = await axios.get(
        `/api/attendance/employee/${employee._id}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      )

      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setAttendanceRecords(response.data)
      } else if (response.data && typeof response.data === "object") {
        // If it's an object with records property
        setAttendanceRecords(Array.isArray(response.data.records) ? response.data.records : [])
      } else {
        // Fallback to empty array
        setAttendanceRecords([])
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast.error("Failed to fetch attendance data")
      setAttendanceRecords([]) // Ensure it's an array on error
      setLoading(false)
    }
  }

  const fetchTodayStatus = async () => {
    if (!employee) return

    try {
      const response = await axios.get(`/api/attendance/employee/${employee._id}/today`)
      setTodayStatus(response.data)

      // If already checked in, set the location and notes
      if (response.data.attendance) {
        setLocation(response.data.attendance.location || "")
        setNotes(response.data.attendance.notes || "")
      }
    } catch (error) {
      console.error("Error fetching today's attendance status:", error)
    }
  }

  const fetchAttendanceStats = async () => {
    if (!employee) return

    try {
      const response = await axios.get(
        `/api/attendance/employee/${employee._id}/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      )

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        // Process stats as array
        const presentStat = response.data.find((item) => item._id === "present") || { count: 0, totalHours: 0 }
        const absentStat = response.data.find((item) => item._id === "absent") || { count: 0 }
        const lateStat = response.data.find((item) => item._id === "late") || { count: 0 }

        setStats({
          present: presentStat.count,
          absent: absentStat.count,
          late: lateStat.count,
          totalHours: presentStat.totalHours ? presentStat.totalHours.toFixed(2) : "0.00",
        })
      } else {
        // Handle if response.data is an object or other format
        setStats({
          present: response.data.present || 0,
          absent: response.data.absent || 0,
          late: response.data.late || 0,
          totalHours: response.data.totalHours ? response.data.totalHours.toFixed(2) : "0.00",
        })
      }
    } catch (error) {
      console.error("Error fetching attendance stats:", error)
      // Set default values on error
      setStats({
        present: 0,
        absent: 0,
        late: 0,
        totalHours: "0.00",
      })
    }
  }

  const handleCheckIn = async () => {
    if (!employee) return

    if (!location.trim()) {
      toast.error("Please enter your location")
      return
    }

    try {
      setCheckingIn(true)
      await axios.post("/api/attendance/check-in", {
        employeeId: employee._id,
        location,
        notes,
      })
      toast.success("Check-in successful")
      fetchTodayStatus()
      fetchAttendanceData()
    } catch (error) {
      console.error("Error checking in:", error)
      toast.error(error.response?.data?.message || "Failed to check in")
    } finally {
      setCheckingIn(false)
    }
  }

  const handleCheckOut = async () => {
    if (!employee) return

    try {
      setCheckingOut(true)
      await axios.post("/api/attendance/check-out", {
        employeeId: employee._id,
        notes,
      })
      toast.success("Check-out successful")
      fetchTodayStatus()
      fetchAttendanceData()
    } catch (error) {
      console.error("Error checking out:", error)
      toast.error(error.response?.data?.message || "Failed to check out")
    } finally {
      setCheckingOut(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "half-day":
        return "bg-blue-100 text-blue-800"
      case "on-leave":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectLocationOption = (option) => {
    setLocation(option)
    setShowLocationOptions(false)
  }

  const formatTimeForDisplay = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Check if it's a weekend
  const isWeekend = () => {
    const day = new Date().getDay()
    return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
  }

  // Check if it's after work hours (after 5 PM)
  const isAfterWorkHours = () => {
    const hour = new Date().getHours()
    return hour >= 17 // 5 PM or later
  }

  // Check if it's before work hours (before 8 AM)
  const isBeforeWorkHours = () => {
    const hour = new Date().getHours()
    return hour < 8 // Before 8 AM
  }

  return (
    <div className="space-y-6">
      {/* Check In/Out Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Attendance</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaUserClock className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Time</p>
              <p className="font-medium">{formatTimeForDisplay(currentTime)}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FaUserClock className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                {todayStatus?.status === "checked-in" && "Checked In"}
                {todayStatus?.status === "checked-out" && "Checked Out"}
                {todayStatus?.status === "not-checked-in" && "Not Checked In"}
                {!todayStatus && "Loading..."}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaHistory className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check In Time</p>
              <p className="font-medium">
                {todayStatus?.attendance?.checkIn
                  ? new Date(todayStatus.attendance.checkIn).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not checked in yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Location input with dropdown */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-500" /> Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowLocationOptions(true)}
              placeholder="Enter your location"
              className="border rounded-md p-2 w-full pr-10"
              disabled={todayStatus?.status === "checked-out"}
            />
            <button
              type="button"
              onClick={() => setShowLocationOptions(!showLocationOptions)}
              className="absolute right-2 top-2 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {showLocationOptions && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {locationOptions.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectLocationOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
            <FaRegStickyNote className="mr-2 text-gray-500" /> Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes for today?"
            className="border rounded-md p-2 w-full"
            rows="2"
            disabled={todayStatus?.status === "checked-out"}
          ></textarea>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            disabled={checkingIn || todayStatus?.status === "checked-in" || todayStatus?.status === "checked-out"}
            className={`px-4 py-2 rounded-md flex items-center justify-center w-1/2 ${
              todayStatus?.status === "checked-in" || todayStatus?.status === "checked-out"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {checkingIn ? "Processing..." : "Check In"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={checkingOut || todayStatus?.status !== "checked-in"}
            className={`px-4 py-2 rounded-md flex items-center justify-center w-1/2 ${
              todayStatus?.status !== "checked-in"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {checkingOut ? "Processing..." : "Check Out"}
          </button>
        </div>

        {/* Contextual messages */}
        {isWeekend() && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
            <p>Note: Today is a weekend. Check with your supervisor about attendance requirements.</p>
          </div>
        )}

        {isBeforeWorkHours() &&
          !isWeekend() &&
          todayStatus?.status !== "checked-in" &&
          todayStatus?.status !== "checked-out" && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
              <p>Good morning! You're early today. Regular work hours start at 8:00 AM.</p>
            </div>
          )}

        {isAfterWorkHours() && !isWeekend() && todayStatus?.status === "checked-in" && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
            <p>Work hours have ended. Don't forget to check out before leaving!</p>
          </div>
        )}
      </div>

      {/* Attendance Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Attendance Statistics</h2>
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border rounded-md p-2"
              dateFormat="yyyy-MM-dd"
            />
            <span>to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="border rounded-md p-2"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Present Days</p>
                <p className="text-2xl font-bold text-gray-800">{stats.present}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <FaUserClock className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Absent Days</p>
                <p className="text-2xl font-bold text-gray-800">{stats.absent}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <FaUserClock className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Late Days</p>
                <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <FaUserClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalHours}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FaChartBar className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance History</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray(attendanceRecords) && attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {record.checkIn
                          ? new Date(record.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            record.status,
                          )}`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{record.workHours || 0}</td>
                      <td className="py-3 px-4">{record.location || "Office"}</td>
                      <td className="py-3 px-4">{record.notes || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeAttendance
