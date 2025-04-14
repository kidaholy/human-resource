"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import axios from "axios"
import { FaMoneyBillWave } from "react-icons/fa"

const EmployeeSalaryHistory = () => {
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [showDebug, setShowDebug] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const fetchSalaryHistory = async () => {
    try {
      // Make sure we have the user
      if (!user) {
        console.log("User not authenticated")
        setError("Please log in to view your salary history")
        setLoading(false)
        return
      }

      // Check if user has the required properties
      console.log("Current user object:", user)

      // For employees, we need to use the user ID to find the employee record
      const userId = user._id

      // Store debug info for troubleshooting
      setDebugInfo({
        user: user,
        userId: userId,
        token: localStorage.getItem("token") ? "Token exists" : "No token found",
      })

      if (!userId) {
        console.log("User ID not found in user object")
        setError("User information not available. Please contact support.")
        setLoading(false)
        return
      }

      console.log("Fetching salary history for user ID:", userId)

      // Use the correct API endpoint
      const token = localStorage.getItem("token")
      console.log("Using token:", token ? "Token exists" : "No token found")

      const response = await axios.get(`http://localhost:5000/api/salary/employee/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Salary history response:", response.data)

      // Check if the response has the expected structure
      if (Array.isArray(response.data)) {
        setSalaries(response.data)
      } else if (response.data && response.data.success && Array.isArray(response.data.salaries)) {
        setSalaries(response.data.salaries)
      } else {
        console.log("Unexpected response format:", response.data)
        setSalaries([])
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching salary history:", err)
      setError(
        `Failed to fetch salary history: ${err.response?.status ? "Request failed with status code " + err.response.status : err.message}`,
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    // Don't try to fetch data until authentication is complete
    if (authLoading) {
      return
    }

    fetchSalaryHistory()
  }, [user, authLoading])

  // If still loading auth, show loading spinner
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="ml-2">Loading user information...</p>
      </div>
    )
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="mt-2 text-sm">
          If you believe this is a mistake, please try refreshing the page or contact the HR department.
        </p>
        <button className="mt-2 text-blue-500 underline" onClick={() => setShowDebug(!showDebug)}>
          {showDebug ? "Hide" : "Show"} Technical Details
        </button>
        {showDebug && debugInfo && (
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaMoneyBillWave className="text-teal-600 text-2xl mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">My Salary History</h1>
        </div>
      </div>

      {salaries.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No salary records found.</p>
              <p className="text-sm text-yellow-700 mt-1">This could be because:</p>
              <ul className="list-disc list-inside text-sm text-yellow-700 ml-2 mt-1">
                <li>You haven't been assigned any salary records yet</li>
                <li>Your employee record might not be properly linked to your user account</li>
                <li>There might be a system issue</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Month
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Basic Salary
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Allowances
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Deductions
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Net Salary
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaries.map((salary, index) => (
                <tr key={salary._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {salary.month ||
                      new Date(salary.paymentDate || salary.payDate).toLocaleString("default", { month: "long" })}{" "}
                    {salary.year || new Date(salary.paymentDate || salary.payDate).getFullYear()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(salary.basicSalary || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(salary.allowances || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(salary.deductions || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    $
                    {Number(
                      salary.netSalary ||
                        (salary.basicSalary || 0) + (salary.allowances || 0) - (salary.deductions || 0),
                    ).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(salary.paymentDate || salary.payDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EmployeeSalaryHistory
