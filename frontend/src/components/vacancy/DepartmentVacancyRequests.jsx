"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FaPlus } from "react-icons/fa"

const DepartmentVacancyRequests = () => {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vacancies/my-requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setVacancies(response.data.vacancies)
        }
      } catch (error) {
        console.error("Error fetching vacancy requests:", error)
        setError("Failed to load your vacancy requests. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
      case "approved":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Vacancy Requests</h2>
        <Link
          to="/department-head-dashboard/request-vacancy"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <FaPlus size={14} />
          <span>Request New Vacancy</span>
        </Link>
      </div>

      {vacancies.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You haven't requested any vacancies yet.</p>
          <Link
            to="/department-head-dashboard/request-vacancy"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            <FaPlus size={14} />
            <span>Request New Vacancy</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-teal-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{vacancy.position}</h3>
                  {getStatusBadge(vacancy.requestStatus)}
                </div>
                <p className="text-sm">{vacancy.department?.dep_name} Department</p>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Positions Available</p>
                  <p className="font-medium">{vacancy.quantity}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-medium">{formatCurrency(vacancy.salary)}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Required Education</p>
                  <p className="font-medium">{vacancy.eduLevel}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Application Deadline</p>
                  <p className="font-medium">{new Date(vacancy.endDate).toLocaleDateString()}</p>
                </div>

                {vacancy.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Feedback:</p>
                    <p className="text-sm text-gray-600">{vacancy.feedback}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    Requested on {new Date(vacancy.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DepartmentVacancyRequests

