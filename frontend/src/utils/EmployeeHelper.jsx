"use client"

import axios from "axios"
import { useNavigate } from "react-router-dom"

export const columns = [
  {
    name: "S.No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Profile",
    cell: (row) => row.profileImage,
    width: "100px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "150px",
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    width: "200px",
  },
  {
    name: "Designation",
    selector: (row) => row.designation,
    sortable: true,
    width: "150px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    sortable: true,
    width: "150px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "120px",
  },
  {
    name: "Actions",
    selector: (row) => row.action,
    width: "300px",
    center: true,
  },
]

export const fetchDepartments = async () => {
  let departments
  try {
    const response = await axios.get(`http://localhost:5000/api/departments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    if (response.data.success) {
      departments = response.data.departments
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      console.log(error.response.data.error)
    }
  }
  return departments
}

// employees for salary form

export const getEmployees = async (id) => {
  let employees
  try {
    const response = await axios.get(`http://localhost:5000/api/employees/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    if (response.data.success) {
      employees = response.data.employees
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      console.log(error.response.data.error)
    }
  }
  return employees
}

export const EmployeeButtons = ({ _id }) => {
  const navigate = useNavigate()
  return (
    <div className="flex space-x-3">
      <button
        onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        View
      </button>
      <button
        onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}
        className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600"
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${_id}`)}
      >
        Salary
      </button>
      <button
        className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        onClick={() => navigate(`/admin-dashboard/leave`)}
      >
        Leave
      </button>
    </div>
  )
}

