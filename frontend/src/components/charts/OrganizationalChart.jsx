"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  FaBuilding,
  FaUser,
  FaUserTie,
  FaSearch,
  FaPrint,
  FaFileExport,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa"

const OrganizationalChart = ({ departmentId = null }) => {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedDepts, setExpandedDepts] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDepartments, setFilteredDepartments] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        // Fetch departments
        const deptResponse = await axios.get(
          departmentId
            ? `http://localhost:5000/api/departments/${departmentId}`
            : "http://localhost:5000/api/departments",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          },
        )

        const deptsData = departmentId ? [deptResponse.data.department] : deptResponse.data.departments

        setDepartments(deptsData)

        // Initialize expanded state for all departments
        const initialExpandedState = {}
        deptsData.forEach((dept) => {
          initialExpandedState[dept._id] = true
        })
        setExpandedDepts(initialExpandedState)

        // Fetch employees
        const empResponse = await axios.get("http://localhost:5000/api/employees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        setEmployees(empResponse.data.employees)
        setFilteredDepartments(deptsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load organizational data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [departmentId])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDepartments(departments)
      return
    }

    const searchTermLower = searchTerm.toLowerCase()

    // Filter departments that match search or have employees that match search
    const filtered = departments.filter((dept) => {
      // Check if department name matches
      if (dept.name.toLowerCase().includes(searchTermLower)) {
        return true
      }

      // Check if any employee in this department matches
      const deptEmployees = employees.filter((emp) => emp.department?._id === dept._id || emp.department === dept._id)
      return deptEmployees.some(
        (emp) =>
          emp.firstName?.toLowerCase().includes(searchTermLower) ||
          emp.lastName?.toLowerCase().includes(searchTermLower) ||
          emp.position?.toLowerCase().includes(searchTermLower) ||
          emp.email?.toLowerCase().includes(searchTermLower),
      )
    })

    setFilteredDepartments(filtered)

    // Auto-expand departments with matches
    const newExpandedState = { ...expandedDepts }
    filtered.forEach((dept) => {
      newExpandedState[dept._id] = true
    })
    setExpandedDepts(newExpandedState)
  }, [searchTerm, departments, employees])

  const toggleDepartment = (deptId) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }))
  }

  const getDepartmentHead = (deptId) => {
    return employees.find(
      (emp) =>
        emp.department &&
        (emp.department._id === deptId || emp.department === deptId) &&
        emp.userId?.role === "department_head",
    )
  }

  const getDepartmentEmployees = (deptId) => {
    return employees.filter(
      (emp) =>
        emp.department &&
        (emp.department._id === deptId || emp.department === deptId) &&
        emp.userId?.role !== "department_head",
    )
  }

  const highlightSearchTerm = (text) => {
    if (!searchTerm.trim() || !text) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 text-black font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    let exportText = "WOLKITE UNIVERSITY ORGANIZATIONAL STRUCTURE\n"
    exportText += "===========================================\n\n"

    filteredDepartments.forEach((dept) => {
      exportText += `DEPARTMENT: ${dept.name}\n`
      exportText += "-------------------------------------------\n"

      const deptHead = getDepartmentHead(dept._id)
      if (deptHead) {
        exportText += `Department Head: ${deptHead.firstName} ${deptHead.lastName} (${deptHead.position})\n`
      } else {
        exportText += "Department Head: Not Assigned\n"
      }

      const deptEmployees = getDepartmentEmployees(dept._id)
      if (deptEmployees.length > 0) {
        exportText += "\nEmployees:\n"
        deptEmployees.forEach((emp) => {
          exportText += `- ${emp.firstName} ${emp.lastName}, ${emp.position}, ${emp.email}\n`
        })
      } else {
        exportText += "\nNo employees in this department.\n"
      }

      exportText += "\n\n"
    })

    // Create and download the file
    const blob = new Blob([exportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "organizational_structure.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 print:shadow-none print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          {departmentId ? "Department Structure" : "Organizational Structure"}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments or employees..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaFileExport /> Export
            </button>
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredDepartments.length} {filteredDepartments.length === 1 ? "department" : "departments"} matching
          your search
        </div>
      )}

      <div className="print:text-sm">
        {/* University Header */}
        <div className="mb-8 text-center print:mb-4">
          <h1 className="text-3xl font-bold text-teal-800 print:text-xl">Wolkite University</h1>
          <p className="text-gray-600 print:text-sm">Organizational Structure</p>
        </div>

        {filteredDepartments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No departments found matching your search criteria.</div>
        ) : (
          <div className="space-y-6 print:space-y-4">
            {filteredDepartments.map((dept) => (
              <div key={dept._id} className="border rounded-lg overflow-hidden">
                {/* Department Header */}
                <div
                  className="bg-gray-100 p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDepartment(dept._id)}
                >
                  <div className="flex items-center">
                    <FaBuilding className="text-teal-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold">{highlightSearchTerm(dept.name)}</h3>
                      <p className="text-sm text-gray-600">{dept.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      {getDepartmentEmployees(dept._id).length + (getDepartmentHead(dept._id) ? 1 : 0)} employees
                    </span>
                    {expandedDepts[dept._id] ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>

                {/* Department Content */}
                {expandedDepts[dept._id] && (
                  <div className="p-4">
                    {/* Department Head */}
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2 text-gray-700 flex items-center">
                        <FaUserTie className="text-teal-600 mr-2" /> Department Head
                      </h4>

                      {getDepartmentHead(dept._id) ? (
                        <div className="ml-6 p-3 bg-teal-50 rounded-lg border border-teal-100">
                          <div className="flex items-start">
                            <div className="bg-teal-100 rounded-full p-2 mr-3">
                              <FaUserTie className="text-teal-700" />
                            </div>
                            <div>
                              <h5 className="font-medium">
                                {highlightSearchTerm(`${getDepartmentHead(dept._id)?.userId?.name || "Unknown"}`)}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {highlightSearchTerm(getDepartmentHead(dept._id).position)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {highlightSearchTerm(getDepartmentHead(dept._id).email)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="ml-6 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 italic">
                          No department head assigned
                        </div>
                      )}
                    </div>

                    {/* Department Employees */}
                    <div>
                      <h4 className="text-md font-medium mb-2 text-gray-700 flex items-center">
                        <FaUser className="text-teal-600 mr-2" /> Employees
                      </h4>

                      {getDepartmentEmployees(dept._id).length > 0 ? (
                        <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {getDepartmentEmployees(dept._id).map((emp) => (
                            <div key={emp._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="font-medium">{highlightSearchTerm(`${emp.userId?.name || "Unknown"}`)}</h5>
                              <p className="text-sm text-gray-600">
                                {highlightSearchTerm(emp.designation || "No position")}
                              </p>
                              <p className="text-xs text-gray-500">
                                {highlightSearchTerm(emp.userId?.email || "No email")}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-6 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 italic">
                          No employees in this department
                        </div>
                      )}
                    </div>

                    {/* Department Statistics */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 text-gray-700">Department Statistics</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>
                              Total Employees:{" "}
                              {getDepartmentEmployees(dept._id).length + (getDepartmentHead(dept._id) ? 1 : 0)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, (getDepartmentEmployees(dept._id).length + (getDepartmentHead(dept._id) ? 1 : 0)) * 5)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationalChart
