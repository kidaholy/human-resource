"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FaPlus, FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { useAuth } from "../../context/authContext"

const JobVacancyList = () => {
  const { user } = useAuth()
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredVacancies, setFilteredVacancies] = useState([])

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Authentication token is missing. Please log in again.")
          setLoading(false)
          return
        }

        const response = await axios.get("http://localhost:5000/api/vacancies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data.success && response.data.vacancies) {
          // Filter vacancies to include approved, rejected, or those directly added by admin
          const relevantVacancies = response.data.vacancies.filter(vacancy => {
            // Include if:
            // 1. It has requestStatus "approved" OR
            // 2. It has requestStatus "rejected" OR
            // 3. It doesn't have a requestStatus (meaning it was directly posted by admin)
            return (
              vacancy.requestStatus === "approved" || 
              vacancy.requestStatus === "rejected" ||
              !vacancy.requestStatus ||
              vacancy.status === "active"
            )
          })

          console.log("All vacancies:", response.data.vacancies)
          console.log("Filtered vacancies:", relevantVacancies)

          setVacancies(relevantVacancies)
          setFilteredVacancies(relevantVacancies)
        } else {
          setVacancies([])
          setFilteredVacancies([])
          setError("No vacancies found")
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error)
        setError("Failed to fetch job vacancies. Please try again later.")
        setVacancies([])
        setFilteredVacancies([])
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
        vacancy.position.toLowerCase().includes(value) ||
        (vacancy.department &&
          vacancy.department.dep_name &&
          vacancy.department.dep_name.toLowerCase().includes(value)),
    )
    setFilteredVacancies(filtered)
  }

  // Get the appropriate status badge for each vacancy
  const getStatusBadge = (vacancy) => {
    if (vacancy.requestStatus === "approved") {
      return (
        <div className="flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded">
          <FaCheckCircle className="mr-1" /> Approved
        </div>
      )
    } else if (vacancy.requestStatus === "rejected") {
      return (
        <div className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded">
          <FaTimesCircle className="mr-1" /> Rejected
        </div>
      )
    }
    return null
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  )

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

      {error && <div className="p-4 mb-4 text-amber-700 bg-amber-100 rounded-md">{error}</div>}

      {filteredVacancies.length === 0 && !error ? (
        <div className="p-4 mb-4 text-gray-700 bg-gray-100 rounded-md">
          No vacancies found. Click "Post New Vacancy" to create one.
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow ${
                vacancy.requestStatus === "rejected" ? "opacity-75" : ""
              }`}
            >
              <div className={`text-white p-4 ${
                vacancy.requestStatus === "rejected" ? "bg-gray-600" : "bg-teal-600"
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{vacancy.position}</h3>
                    <p className="text-sm">{vacancy.department?.dep_name || "Department"} Department</p>
                  </div>
                  {getStatusBadge(vacancy)}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Positions Available</p>
                  <p className="font-medium">{vacancy.quantity}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-medium">${vacancy.salary?.toLocaleString() || "N/A"}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Required Education</p>
                  <p className="font-medium">{vacancy.eduLevel || "N/A"}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Application Deadline</p>
                  <p className="font-medium">
                    {vacancy.endDate ? new Date(vacancy.endDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                {vacancy.requestStatus === "rejected" && vacancy.feedback && (
                  <div className="mb-4 p-2 bg-red-50 text-red-800 rounded-md">
                    <p className="text-sm font-semibold">Rejection Reason:</p>
                    <p className="text-sm">{vacancy.feedback}</p>
                  </div>
                )}
                <div className="flex justify-between items-center mt-6">
                  <span className="text-xs text-gray-500">
                    Posted on {vacancy.createdAt ? new Date(vacancy.createdAt).toLocaleDateString() : "N/A"}
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

