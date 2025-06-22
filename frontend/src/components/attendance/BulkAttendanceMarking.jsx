"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaUserCheck, FaUserTimes, FaSearch } from "react-icons/fa"
import { useAuth } from "../../context/authContext"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const BulkAttendanceMarking = () => {
  const { user } = useAuth()
  const [departmentHead, setDepartmentHead] = useState(null)
  const [departmentEmployees, setDepartmentEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState("present")
  const [notes, setNotes] = useState("")
  const [location, setLocation] = useState("Office")

  useEffect(() => {
    fetchDepartmentHeadData()
  }, [user])

  useEffect(() => {
    if (departmentHead) {
      fetchDepartmentEmployees()
    }
  }, [departmentHead])

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
      setLoading(true)
      const response = await axios.get(`/api/departments/${departmentHead.departmentId}/employees`)
      setDepartmentEmployees(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching department employees:", error)
      toast.error("Failed to fetch department employees")
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(departmentEmployees.map((employee) => employee._id))
    }
    setSelectAll(!selectAll)
  }

  const handleEmployeeSelect = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId))
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId])
    }
  }

  const handleBulkAttendanceSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee")
      return
    }

    try {
      setSubmitting(true)

      // Format date
      const formattedDate = new Date(selectedDate)
      formattedDate.setHours(0, 0, 0, 0)

      // Create attendance records for each selected employee
      const attendanceData = {
        employeeIds: selectedEmployees,
        date: formattedDate.toISOString(),
        status: attendanceStatus,
        notes,
        location,
        isManualEntry: true,
      }

      await axios.post("/api/attendance/bulk", attendanceData)
      toast.success(`Attendance marked as ${attendanceStatus} for ${selectedEmployees.length} employees`)

      // Reset selections
      setSelectedEmployees([])
      setSelectAll(false)
      setNotes("")
    } catch (error) {
      console.error("Error submitting bulk attendance:", error)
      toast.error(error.response?.data?.message || "Failed to submit attendance")
    } finally {
      setSubmitting(false)
    }
  }

  // Filter employees based on search query
  const filteredEmployees = departmentEmployees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Bulk Attendance Marking</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border rounded-md p-2 w-full"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half-day">Half Day</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Office, Remote, etc."
            className="border rounded-md p-2 w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (applies to all selected)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes for this attendance record"
          className="border rounded-md p-2 w-full"
          rows="2"
        ></textarea>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="mr-2" />
            <label className="text-sm font-medium text-gray-700">Select All Employees</label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
              className="border rounded-md p-2 pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="border rounded-md overflow-y-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Select
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee._id)}
                          onChange={() => handleEmployeeSelect(employee._id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="py-3 px-4">{employee.position}</td>
                      <td className="py-3 px-4">{employee.employeeId}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleBulkAttendanceSubmit}
          disabled={submitting || selectedEmployees.length === 0}
          className={`px-4 py-2 rounded-md flex items-center ${
            submitting || selectedEmployees.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : attendanceStatus === "present" || attendanceStatus === "late" || attendanceStatus === "half-day"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {submitting ? (
            "Processing..."
          ) : attendanceStatus === "present" || attendanceStatus === "late" || attendanceStatus === "half-day" ? (
            <>
              <FaUserCheck className="mr-2" /> Mark {selectedEmployees.length} Employees as{" "}
              {attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}
            </>
          ) : (
            <>
              <FaUserTimes className="mr-2" /> Mark {selectedEmployees.length} Employees as{" "}
              {attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default BulkAttendanceMarking
