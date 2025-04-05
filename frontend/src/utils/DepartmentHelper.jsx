"use client"

import { useNavigate } from "react-router-dom"
import axios from "axios"

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
    const confirm = window.confirm("Do you want to delete?")
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
        }
      }
    }
  }
  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>
      <button className="px-3 py-1 bg-red-600 text-white" onClick={() => handleDelete(_id)}>
        Delete
      </button>
    </div>
  )
}

