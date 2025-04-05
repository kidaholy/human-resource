"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { fetchDepartments } from "../../utils/EmployeeHelper"

const AddVacancy = () => {
  const [departments, setDepartments] = useState([])
  const [vacancyData, setVacancyData] = useState({
    position: "",
    department: "",
    quantity: 1,
    salary: "",
    experience: "",
    eduLevel: "",
    endDate: "",
    gender: "any",
    cgpa: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setVacancyData({ ...vacancyData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/api/vacancies/add", vacancyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        navigate("/admin-dashboard/vacancies")
      }
    } catch (error) {
      console.error("Error posting vacancy:", error)
      setError(error.response?.data?.error || "An error occurred while posting vacancy")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Post New Job Vacancy</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Position Title
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={vacancyData.position}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={vacancyData.department}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Number of Positions
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={vacancyData.quantity}
              onChange={handleChange}
              min="1"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={vacancyData.salary}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Education Level */}
          <div>
            <label htmlFor="eduLevel" className="block text-sm font-medium text-gray-700">
              Required Education
            </label>
            <input
              type="text"
              id="eduLevel"
              name="eduLevel"
              value={vacancyData.eduLevel}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Required Experience
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={vacancyData.experience}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender Preference
            </label>
            <select
              id="gender"
              name="gender"
              value={vacancyData.gender}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* CGPA */}
          <div>
            <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700">
              Minimum CGPA
            </label>
            <input
              type="number"
              id="cgpa"
              name="cgpa"
              value={vacancyData.cgpa}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="4.0"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={vacancyData.endDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={vacancyData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Posting..." : "Post Vacancy"}
        </button>
      </form>
    </div>
  )
}

export default AddVacancy

