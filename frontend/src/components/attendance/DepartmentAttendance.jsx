"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaCalendarAlt, FaFilter, FaFileExport, FaSearch, FaChartBar, FaUserPlus, FaEdit } from "react-icons/fa"
import { useAuth } from "../../context/authContext"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import BulkAttendanceMarking from "./BulkAttendanceMarking"

const DepartmentAttendance = () => {
  const { user } = useAuth()
  const [departmentHead, setDepartmentHead] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [departmentEmployees, setDepartmentEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState(new Date())
  const [filters, setFilters] = useState({
    status: "",
    searchQuery: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    totalHours: 0,
    totalEmployees: 0,
  })
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [attendanceData, setAttendanceData] = useState({
    checkIn: "",
    checkOut: "",
    status: "present",
    notes: "",
    location: "Office",
  })
  const [submitting, setSubmitting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editRecordId, setEditRecordId] = useState(null)
  const [activeTab, setActiveTab] = useState("records")

  useEffect(() => {
    fetchDepartmentHeadData()
  }, [user])

  useEffect(() => {
    if (departmentHead) {
      fetchAttendanceData()
      fetchAttendanceStats()
      fetchDepartmentEmployees()
    }
  }, [departmentHead, startDate, endDate, filters.status])

  const fetchDepartmentHeadData = async () => {
    try {
      const response = await axios.get(`/api/employees/user/${user.id}`)
      setDepartmentHead(response.data)
    } catch (error) {
      console.error("Error fetching department head data:", error)
      toast.error("Failed to fetch department head data")
    }
  }

  const fetchDepartmentEmployees = async () => {
    if (!departmentHead?.departmentId) return

    try {
      const response = await axios.get(`/api/departments/${departmentHead.departmentId}/employees`)
      setDepartmentEmployees(response.data)
    } catch (error) {
      console.error("Error fetching department employees:", error)
      toast.error("Failed to fetch department employees")
    }
  }

  const fetchAttendanceData = async () => {
    if (!departmentHead?.departmentId) return

    try {
      setLoading(true)
      let url = `/api/attendance/department/${departmentHead.departmentId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`

      if (filters.status) {
        url += `&status=${filters.status}`
      }

      const response = await axios.get(url)
      // Ensure attendanceRecords is always an array
      setAttendanceRecords(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast.error("Failed to fetch attendance data")
      setLoading(false)
      // Set to empty array on error
      setAttendanceRecords([])
    }
  }

  const fetchAttendanceStats = async () => {
    if (!departmentHead?.departmentId) return

    try {
      // Get department stats
      const statsResponse = await axios.get(
        `/api/attendance/department/${departmentHead.departmentId}/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      )

      // Get employee count
      const employeesResponse = await axios.get(`/api/departments/${departmentHead.departmentId}/employees/count`)

      // Process stats
      const presentStat = statsResponse.data.find((item) => item._id === "present") || { count: 0, totalHours: 0 }
      const absentStat = statsResponse.data.find((item) => item._id === "absent") || { count: 0 }
      const lateStat = statsResponse.data.find((item) => item._id === "late") || { count: 0 }

      setStats({
        present: presentStat.count,
        absent: absentStat.count,
        late: lateStat.count,
        totalHours: presentStat.totalHours.toFixed(2),
        totalEmployees: employeesResponse.data.count,
      })
    } catch (error) {
      console.error("Error fetching attendance stats:", error)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      searchQuery: "",
    })
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)))
    setEndDate(new Date())
  }

  const exportToCSV = () => {
    // Filter records based on search query
    const filteredRecords = Array.isArray(attendanceRecords)
      ? attendanceRecords.filter((record) => {
          const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`.toLowerCase()
          const searchLower = filters.searchQuery.toLowerCase()
          return employeeName.includes(searchLower)
        })
      : []

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "Employee,Date,Check In,Check Out,Status,Work Hours,Notes\n"

    filteredRecords.forEach((record) => {
      const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`
      const date = new Date(record.date).toLocaleDateString()
      const checkIn = record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"
      const checkOut = record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"
      const status = record.status
      const workHours = record.workHours || 0
      const notes = record.notes || ""

      csvContent += `"${employeeName}","${date}","${checkIn}","${checkOut}","${status}","${workHours}","${notes}"\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `department_attendance_report_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter records based on search query
  const filteredRecords = Array.isArray(attendanceRecords)
    ? attendanceRecords.filter((record) => {
        const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`.toLowerCase()
        const searchLower = filters.searchQuery.toLowerCase()
        return employeeName.includes(searchLower)
      })
    : []

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

  const openAttendanceModal = (isEdit = false, record = null) => {
    if (isEdit && record) {
      setEditMode(true)
      setEditRecordId(record._id)
      setSelectedEmployee(record.employeeId._id)
      setSelectedDate(new Date(record.date))
      setAttendanceData({
        checkIn: record.checkIn ? new Date(record.checkIn).toTimeString().slice(0, 5) : "",
        checkOut: record.checkOut ? new Date(record.checkOut).toTimeString().slice(0, 5) : "",
        status: record.status,
        notes: record.notes || "",
        location: record.location || "Office",
      })
    } else {
      setEditMode(false)
      setEditRecordId(null)
      setSelectedEmployee("")
      setSelectedDate(new Date())
      setAttendanceData({
        checkIn: "",
        checkOut: "",
        status: "present",
        notes: "",
        location: "Office",
      })
    }
    setShowAttendanceModal(true)
  }

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false)
    setEditMode(false)
    setEditRecordId(null)
  }

  const handleAttendanceInputChange = (e) => {
    const { name, value } = e.target
    setAttendanceData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitAttendance = async (e) => {
    e.preventDefault()
    if (!selectedEmployee) {
      toast.error("Please select an employee")
      return
    }

    try {
      setSubmitting(true)

      // Format date and times
      const formattedDate = new Date(selectedDate)
      formattedDate.setHours(0, 0, 0, 0)

      let checkInTime = null
      if (attendanceData.checkIn) {
        const [hours, minutes] = attendanceData.checkIn.split(":").map(Number)
        checkInTime = new Date(formattedDate)
        checkInTime.setHours(hours, minutes, 0, 0)
      }

      let checkOutTime = null
      if (attendanceData.checkOut) {
        const [hours, minutes] = attendanceData.checkOut.split(":").map(Number)
        checkOutTime = new Date(formattedDate)
        checkOutTime.setHours(hours, minutes, 0, 0)
      }

      const attendancePayload = {
        employeeId: selectedEmployee,
        date: formattedDate.toISOString(),
        checkIn: checkInTime ? checkInTime.toISOString() : null,
        checkOut: checkOutTime ? checkOutTime.toISOString() : null,
        status: attendanceData.status,
        notes: attendanceData.notes,
        location: attendanceData.location,
        isManualEntry: true,
      }

      if (editMode && editRecordId) {
        // Update existing record
        await axios.put(`/api/attendance/${editRecordId}`, attendancePayload)
        toast.success("Attendance record updated successfully")
      } else {
        // Create new record
        await axios.post("/api/attendance/manage", attendancePayload)
        toast.success("Attendance record created successfully")
      }

      closeAttendanceModal()
      fetchAttendanceData()
      fetchAttendanceStats()
    } catch (error) {
      console.error("Error submitting attendance:", error)
      toast.error(error.response?.data?.message || "Failed to submit attendance")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAttendance = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await axios.delete(`/api/attendance/${id}`)
        toast.success("Attendance record deleted successfully")
        fetchAttendanceData()
        fetchAttendanceStats()
      } catch (error) {
        console.error("Error deleting attendance:", error)
        toast.error("Failed to delete attendance record")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "records" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("records")}
          >
            Attendance Records
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "bulk" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("bulk")}
          >
            Bulk Attendance Marking
          </button>
        </div>
      </div>
      {activeTab === "records" ? (
        <>
          {/* Department Attendance Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Department Attendance Statistics</h2>
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaChartBar className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.present}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCalendarAlt className="text-green-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.absent}</p>
                  </div>
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaCalendarAlt className="text-red-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Late</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.late}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <FaCalendarAlt className="text-yellow-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalHours}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaChartBar className="text-purple-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Attendance Records */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Department Attendance Records</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => openAttendanceModal()}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaUserPlus className="mr-2" /> Add Attendance
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
                >
                  <FaFilter className="mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaFileExport className="mr-2" /> Export
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="border rounded-md p-2 w-full"
                    >
                      <option value="">All Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half-day">Half Day</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="searchQuery"
                        value={filters.searchQuery}
                        onChange={handleFilterChange}
                        placeholder="Search by employee name..."
                        className="border rounded-md p-2 pl-10 w-full"
                      />
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

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
                        Employee
                      </th>
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
                        Notes
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {record.employeeId.firstName} {record.employeeId.lastName}
                          </td>
                          <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
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
                          <td className="py-3 px-4">{record.notes || "-"}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openAttendanceModal(true, record)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-4 text-center text-gray-500">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Attendance Modal */}
          {showAttendanceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                  {editMode ? "Edit Attendance Record" : "Add Attendance Record"}
                </h2>
                <form onSubmit={handleSubmitAttendance}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="border rounded-md p-2 w-full"
                      required
                      disabled={editMode}
                    >
                      <option value="">Select Employee</option>
                      {departmentEmployees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.firstName} {employee.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      className="border rounded-md p-2 w-full"
                      dateFormat="yyyy-MM-dd"
                      disabled={editMode}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time</label>
                      <input
                        type="time"
                        name="checkIn"
                        value={attendanceData.checkIn}
                        onChange={handleAttendanceInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check Out Time</label>
                      <input
                        type="time"
                        name="checkOut"
                        value={attendanceData.checkOut}
                        onChange={handleAttendanceInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={attendanceData.status}
                      onChange={handleAttendanceInputChange}
                      className="border rounded-md p-2 w-full"
                      required
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half-day">Half Day</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={attendanceData.location}
                      onChange={handleAttendanceInputChange}
                      placeholder="Office, Remote, etc."
                      className="border rounded-md p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={attendanceData.notes}
                      onChange={handleAttendanceInputChange}
                      placeholder="Any notes about this attendance record"
                      className="border rounded-md p-2 w-full"
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={closeAttendanceModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      {submitting ? "Submitting..." : editMode ? "Update" : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <BulkAttendanceMarking />
      )}
    </div>
  )
}

export default DepartmentAttendance
