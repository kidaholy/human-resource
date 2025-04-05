"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { EmployeeButtons, columns } from "../../utils/EmployeeHelper"
import DataTable from "react-data-table-component"

const List = () => {
  const [employees, setEmployees] = useState([])
  const [empLoading, setEmpLoading] = useState(false)
  const [filteredEmployee, setFilteredEmployee] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true)
      try {
        const response = await axios.get("http://localhost:5000/api/employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log("Response data:", response.data)
        if (response.data.success) {
          let sno = 1
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department?.dep_name || "Not Assigned",
            name: emp.userId?.name || "Unknown",
            email: emp.userId?.email || "Not Available",
            designation: emp.designation || "Not Assigned",
            dob: emp.dob ? new Date(emp.dob).toLocaleDateString() : "Not Available",
            profileImage: emp.userId?.profileImage ? (
              <img
                src={`http://localhost:5000/${emp.userId.profileImage}`}
                alt={`${emp.userId.name}'s profile`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{emp.userId?.name?.[0] || "?"}</span>
              </div>
            ),
            action: <EmployeeButtons _id={emp._id} />,
          }))
          setEmployees(data)
          setFilteredEmployee(data)
        }
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setEmpLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleFilter = (e) => {
    const records = employees.filter((emp) => emp.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilteredEmployee(records)
  }

  return (
    <div className="p-5">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Search By Emp Name" className="px-4 py-0.5 border" onChange={handleFilter} />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 bg-teal-600 rounded-lg text-white hover:bg-teal-700 transition-colors"
        >
          Add New Employee
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <DataTable
          title="Employee List"
          data={filteredEmployee}
          columns={columns}
          pagination
          progressPending={empLoading}
        />
      </div>
    </div>
  )
}

export default List

