"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const EditDepartment = () => {
  const { id } = useParams()
  const [departments, setDepartments] = useState([])
  const [depLoading, setDepLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/departments/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log(response.data)
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(error.response.data.error)
        }
      } finally {
        setDepLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDepartments({ ...departments, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:5000/api/departments/${id}`, departments, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.data.success) {
        navigate("/admin-dashboard/departments")
      }
      console.log(response)
    } catch (error) {
      console.log(error)
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    }
  }

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Update Department</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
                Deoartment Name
              </label>
              <input
                type="text"
                name="dep_name"
                onChange={handleChange}
                value={departments.dep_name}
                placeholder="Enter Dep Name"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Desription
              </label>
              <textarea
                type="text"
                name="description"
                onChange={handleChange}
                value={departments.description}
                placeholder="Description"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <button
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Update Department
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default EditDepartment

