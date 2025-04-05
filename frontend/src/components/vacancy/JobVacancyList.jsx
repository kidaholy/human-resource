"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FaPlus, FaSearch } from "react-icons/fa"

const JobVacancyList = () => {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredVacancies, setFilteredVacancies] = useState([])

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vacancies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          // Mock data for demonstration
          const mockData = [
            {
              _id: "vac1",
              position: "Senior Lecturer",
              department: {
                _id: "dep1",
                dep_name: "Computer Science",
              },
              quantity: 2,
              salary: 50000,
              experience: "Minimum 5 years of teaching experience",
              eduLevel: "PhD in Computer Science or related field",
              endDate: "2023-12-31",
              status: "active",
              createdAt: "2023-05-15",
            },
            {
              _id: "vac2",
              position: "Assistant Professor",
              department: {
                _id: "dep2",
                dep_name: "Electrical Engineering",
              },
              quantity: 1,
              salary: 45000,
              experience: "Minimum 3 years of teaching experience",
              eduLevel: "PhD in Electrical Engineering",
              endDate: "2023-11-30",
              status: "active",
              createdAt: "2023-05-20",
            },
            {
              _id: "vac3",
              position: "Lab Assistant",
              department: {
                _id: "dep1",
                dep_name: "Computer Science",
              },
              quantity: 3,
              salary: 25000,
              experience: "1-2 years of lab experience",
              eduLevel: "Bachelor's degree in Computer Science",
              endDate: "2023-10-15",
              status: "active",
              createdAt: "2023-06-01",
            },
          ]
          setVacancies(mockData)
          setFilteredVacancies(mockData)
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error)
        setError("Failed to fetch job vacancies")
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase()
    const filtered = vacancies.filter(
      (vacancy) =>
        vacancy.position.toLowerCase().includes(value) || vacancy.department.dep_name.toLowerCase().includes(value),
    )
    setFilteredVacancies(filtered)
  }

  if (loading) return <div className="p-4">Loading job vacancies...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Job Vacancies</h2>
        <Link
          to="/admin-dashboard/add-vacancy"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <FaPlus size={14} />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by position or department"
          className="pl-10 pr-4 py-2 border rounded-md w-full md:w-1/3"
          onChange={handleFilter}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="bg-teal-600 text-white p-4">
                <h3 className="text-xl font-bold">{vacancy.position}</h3>
                <p className="text-sm">{vacancy.department.dep_name} Department</p>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Positions Available</p>
                  <p className="font-medium">{vacancy.quantity}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-medium">${vacancy.salary.toLocaleString()}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Required Education</p>
                  <p className="font-medium">{vacancy.eduLevel}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Application Deadline</p>
                  <p className="font-medium">{new Date(vacancy.endDate).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-xs text-gray-500">
                    Posted on {new Date(vacancy.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/admin-dashboard/vacancy/${vacancy._id}`}
                    className="px-4 py-2 bg-teal-100 text-teal-800 rounded-md hover:bg-teal-200 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">No job vacancies found</div>
        )}
      </div>
    </div>
  )
}

export default JobVacancyList

