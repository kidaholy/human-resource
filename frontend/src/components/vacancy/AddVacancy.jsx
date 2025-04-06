"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa"

const AddVacancy = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    position: "",
    department: "",
    quantity: 1,
    salary: "",
    experience: "",
    eduLevel: "",
    description: "",
    endDate: "",
  })

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/departments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        // Mock data for departments
        setDepartments([
          { _id: "dep1", dep_name: "Computer Science" },
          { _id: "dep2", dep_name: "Electrical Engineering" },
          { _id: "dep3", dep_name: "Mechanical Engineering" },
          { _id: "dep4", dep_name: "Civil Engineering" },
        ])
      }
    }

    fetchDepartments()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post("http://localhost:5000/api/vacancies/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        setSuccess("Vacancy posted successfully!")
        setTimeout(() => {
          navigate("/admin-dashboard/vacancies")
        }, 2000)
      } else {
        setError(response.data.message || "Failed to post vacancy")
      }
    } catch (error) {
      console.error("Error posting vacancy:", error)
      setError("Failed to post vacancy. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin-dashboard/vacancies")}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">Post New Job Vacancy</h2>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position Title*
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department*
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.dep_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Positions*
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Salary (ETB)*
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Required Experience*
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Minimum 3 years of teaching experience"
            />
          </div>

          <div>
            <label htmlFor="eduLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Required Education Level*
            </label>
            <input
              type="text"
              id="eduLevel"
              name="eduLevel"
              value={formData.eduLevel}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g., PhD in Computer Science"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline*
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/vacancies")}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-300"
          >
            {loading ? "Posting..." : "Post Vacancy"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddVacancy

