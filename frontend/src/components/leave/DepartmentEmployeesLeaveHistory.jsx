import { useEffect, useState } from "react"
import axios from "axios"

const DepartmentEmployeesLeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([])
  const [departmentName, setDepartmentName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leave/department-employees-history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setLeaveHistory(response.data.leaveHistory)
          setDepartmentName(response.data.departmentName)
        }
      } catch (error) {
        console.error("Error fetching leave history:", error)
        setError("Failed to load leave history")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveHistory()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">{departmentName} - Employee Leave History</h2>
      
      {leaveHistory.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No leave history found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveHistory.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {leave.employeeId?.userId?.profileImage ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://localhost:5000/${leave.employeeId.userId.profileImage}`}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg"
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xl text-gray-500">
                                {leave.employeeId?.userId?.name?.[0] || "?"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {leave.employeeId?.userId?.name}
                          </div>
                          <div className="text-sm text-gray-500">{leave.employeeId?.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {leave.leaveType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{leave.totalDays} days</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{leave.reason}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepartmentEmployeesLeaveHistory 