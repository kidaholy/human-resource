"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaUserCheck, FaFilter, FaFileExport, FaSearch } from "react-icons/fa"
import { useAuth } from "../../context/authContext"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const AttendanceManagement = () => {
  const { user } = useAuth()
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState(new Date())
  const [departments, setDepartments] = useState([])
  const [filters, setFilters] = useState({
    departmentId: "",
    status: "",
    searchQuery: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date(),
    checkIn: "",
    checkOut: "",
    status: "present",
    notes: "",
  })
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    fetchAttendanceData()
    fetchDepartments()
    fetchEmployees()
  }, [startDate, endDate, filters.departmentId, filters.status])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      let url = `/api/attendance?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`

      if (filters.departmentId) {
        url += `&departmentId=${filters.departmentId}`
      }

      if (filters.status) {
        url += `&status=${filters.status}`
      }

      const response = await axios.get(url)
      // Ensure we're setting an array to state
      setAttendanceRecords(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast.error("Failed to fetch attendance data")
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments")
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/employees")
      setEmployees(response.data)
    } catch (error) {
      console.error("Error fetching employees:", error)
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
      departmentId: "",
      status: "",
      searchQuery: "",
    })
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)))
    setEndDate(new Date())
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchAttendanceData()
  }

  const openAddModal = () => {
    setSelectedRecord(null)
    setFormData({
      employeeId: "",
      date: new Date(),
      checkIn: "",
      checkOut: "",
      status: "present",
      notes: "",
    })
    setShowModal(true)
  }

  const openEditModal = (record) => {
    const checkInTime = record.checkIn ? new Date(record.checkIn) : null
    const checkOutTime = record.checkOut ? new Date(record.checkOut) : null

    setSelectedRecord(record)
    setFormData({
      employeeId: record.employeeId._id,
      date: new Date(record.date),
      checkIn: checkInTime
        ? `${checkInTime.getHours().toString().padStart(2, "0")}:${checkInTime.getMinutes().toString().padStart(2, "0")}`
        : "",
      checkOut: checkOutTime
        ? `${checkOutTime.getHours().toString().padStart(2, "0")}:${checkOutTime.getMinutes().toString().padStart(2, "0")}`
        : "",
      status: record.status,
      notes: record.notes || "",
    })
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const selectedDate = new Date(formData.date)

      // Process check-in time
      let checkInDateTime = null
      if (formData.checkIn) {
        const [hours, minutes] = formData.checkIn.split(":").map(Number)
        checkInDateTime = new Date(selectedDate)
        checkInDateTime.setHours(hours, minutes, 0, 0)
      }

      // Process check-out time
      let checkOutDateTime = null
      if (formData.checkOut) {
        const [hours, minutes] = formData.checkOut.split(":").map(Number)
        checkOutDateTime = new Date(selectedDate)
        checkOutDateTime.setHours(hours, minutes, 0, 0)
      }

      const attendanceData = {
        employeeId: formData.employeeId,
        date: selectedDate.toISOString(),
        checkIn: checkInDateTime ? checkInDateTime.toISOString() : null,
        checkOut: checkOutDateTime ? checkOutDateTime.toISOString() : null,
        status: formData.status,
        notes: formData.notes,
        isManualEntry: true,
      }

      await axios.post("/api/attendance/manage", attendanceData)

      toast.success(selectedRecord ? "Attendance record updated successfully" : "Attendance record added successfully")
      setShowModal(false)
      fetchAttendanceData()
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast.error("Failed to save attendance record")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await axios.delete(`/api/attendance/${id}`)
        toast.success("Attendance record deleted successfully")
        fetchAttendanceData()
      } catch (error) {
        console.error("Error deleting attendance:", error)
        toast.error("Failed to delete attendance record")
      }
    }
  }

  const exportToCSV = () => {
    // Filter records based on search query
    const recordsToExport = Array.isArray(attendanceRecords) ? attendanceRecords : []
    const filteredRecords = recordsToExport.filter((record) => {
      if (!record || !record.employeeId) return false
      const employeeName = `${record.employeeId.firstName || ""} ${record.employeeId.lastName || ""}`.toLowerCase()
      const department = record.employeeId.departmentId?.name?.toLowerCase() || ""
      const searchLower = filters.searchQuery.toLowerCase()

      return employeeName.includes(searchLower) || department.includes(searchLower)
    })

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "Employee,Department,Date,Check In,Check Out,Status,Work Hours,Notes\n"

    filteredRecords.forEach((record) => {
      const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`
      const department = record.employeeId.departmentId?.name || "N/A"
      const date = new Date(record.date).toLocaleDateString()
      const checkIn = record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"
      const checkOut = record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"
      const status = record.status
      const workHours = record.workHours || 0
      const notes = record.notes || ""

      csvContent += `"${employeeName}","${department}","${date}","${checkIn}","${checkOut}","${status}","${workHours}","${notes}"\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter records based on search query
  const filteredRecords = Array.isArray(attendanceRecords)
    ? attendanceRecords.filter((record) => {
        if (!record || !record.employeeId) return false
        const employeeName = `${record.employeeId.firstName || ""} ${record.employeeId.lastName || ""}`.toLowerCase()
        const department = record.employeeId.departmentId?.name?.toLowerCase() || ""
        const searchLower = filters.searchQuery.toLowerCase()

        return employeeName.includes(searchLower) || department.includes(searchLower)
      })
    : []

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Attendance Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={openAddModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaUserCheck className="mr-2" /> Add Attendance
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border rounded-md p-2 w-full"
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
                  className="border rounded-md p-2 w-full"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="departmentId"
                value={filters.departmentId}
                onChange={handleFilterChange}
                className="border rounded-md p-2 w-full"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
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
          </div>
          <div className="mt-4 flex justify-between">
            <div className="relative w-64">
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="Search employee or department..."
                className="border rounded-md p-2 pl-10 w-full"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button onClick={resetFilters} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md">
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
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
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
                      <td className="py-3 px-4">{record.employeeId.departmentId?.name || "N/A"}</td>
                      <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                                ? "bg-red-100 text-red-800"
                                : record.status === "late"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : record.status === "half-day"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{record.workHours || 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(record._id)} className="text-red-600 hover:text-red-900">
                            Delete
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
        </>
      )}

      {/* Add/Edit Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {selectedRecord ? "Edit Attendance Record" : "Add Attendance Record"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="border rounded-md p-2 w-full"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  className="border rounded-md p-2 w-full"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check In Time</label>
                  <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check Out Time</label>
                  <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="border rounded-md p-2 w-full"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
                  {selectedRecord ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceManagement
