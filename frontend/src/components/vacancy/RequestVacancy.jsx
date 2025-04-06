"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const RequestVacancy = () => {
  const [vacancyData, setVacancyData] = useState({
    position: "",
    quantity: 1,
    salary: "",
    experience: "",
    eduLevel: "",
    endDate: "",
    gender: "any",
    cgpa: "",
    description: "",
    justification: "", // New field for department head to justify the request
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setVacancyData({ ...vacancyData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/api/vacancies/request", vacancyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        navigate("/department-head-dashboard/my-vacancy-requests")
      }
    } catch (error) {
      console.error("Error requesting vacancy:", error)
      setError(error.response?.data?.error || "An error occurred while requesting vacancy")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request New Job Vacancy</h2>
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

          {/* Justification */}
          <div className="md:col-span-2">
            <label htmlFor="justification" className="block text-sm font-medium text-gray-700">
              Justification for Request
            </label>
            <textarea
              id="justification"
              name="justification"
              value={vacancyData.justification}
              onChange={handleChange}
              rows="4"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              placeholder="Please explain why this position is needed in your department"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Submitting..." : "Submit Vacancy Request"}
        </button>
      </form>
    </div>
  )
}

export default RequestVacancy

