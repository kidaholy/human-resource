"use client"

import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaEdit, FaTrash } from "react-icons/fa"

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate()
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this department? This action cannot be undone.")
    if (confirm) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/departments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log(response.data)
        if (response.data.success) {
          onDepartmentDelete(id)
          navigate("/admin-dashboard/departments")
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(error.response.data.error)
          alert("Error deleting department: " + (error.response.data.error || "Unknown error"))
        }
      }
    }
  }
  return (
    <div className="flex space-x-2">
      <button
        className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
        title="Edit Department"
      >
        <FaEdit />
      </button>
      <button
        className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
        onClick={() => handleDelete(_id)}
        title="Delete Department"
      >
        <FaTrash />
      </button>
    </div>
  )
}

