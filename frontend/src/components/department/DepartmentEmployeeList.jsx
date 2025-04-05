"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DataTable from "react-data-table-component"
import { FaSearch } from "react-icons/fa"

const DepartmentEmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [departmentName, setDepartmentName] = useState("")

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://localhost:5000/api/employees/department-employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          let sno = 1
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            name: emp.userId?.name || "Unknown",
            email: emp.userId?.email || "No email",
            designation: emp.designation || "Not specified",
            employeeId: emp.employeeId || "Not assigned",
            profileImage: (
              <img
                src={`http://localhost:5000/${emp.userId?.profileImage}`}
                width={40}
                height={40}
                className="rounded-full"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=40&width=40"
                }}
              />
            ),
            role: emp.userId?.role || "Unknown",
          }))

          setEmployees(data)
          setFilteredEmployees(data)
          setDepartmentName(response.data.departmentName || "Your Department")
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
        setError("Failed to load department employees")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase()
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(value) ||
        emp.designation.toLowerCase().includes(value) ||
        emp.employeeId.toLowerCase().includes(value),
    )
    setFilteredEmployees(filtered)
  }

  const columns = [
    {
      name: "S.No",
      selector: (row) => row.sno,
      width: "70px",
    },
    {
      name: "Image",
      cell: (row) => row.profileImage,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Employee ID",
      selector: (row) => row.employeeId,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.role === "department_head" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
          }`}
        >
          {row.role === "department_head" ? "Department Head" : "Employee"}
        </span>
      ),
    },
  ]

  if (loading) return <div className="p-6">Loading department employees...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{departmentName} Employees</h2>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, ID or designation"
          className="pl-10 pr-4 py-2 border rounded-md w-full md:w-1/3"
          onChange={handleFilter}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          highlightOnHover
          responsive
          noDataComponent="No employees found in your department"
        />
      </div>
    </div>
  )
}

export default DepartmentEmployeeList

