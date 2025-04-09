"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/authContext"
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa"

const DepartmentVacancyRequests = () => {
  const { user } = useAuth()
  const [vacancyRequests, setVacancyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [debug, setDebug] = useState({})

  useEffect(() => {
    const fetchVacancyRequests = async () => {
      try {
        // Make sure we have the auth token
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token is missing. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching vacancy requests for user:", user?._id || user?.id);

        // Use the correct API endpoint for department head's vacancy requests
        const response = await axios.get("http://localhost:5000/api/vacancies/my-requests", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Vacancy requests response:", response.data);
        setDebug(response.data); // Store for debugging

        // Check if the response has the expected structure
        if (response.data.success && response.data.vacancies && Array.isArray(response.data.vacancies)) {
          // Map the vacancies to ensure all fields are properly accessed
          const formattedVacancies = response.data.vacancies.map(vacancy => ({
            _id: vacancy._id,
            position: vacancy.position || "Untitled Position",
            department: vacancy.department,
            departmentName: vacancy.department?.dep_name || "Unknown Department",
            createdAt: vacancy.createdAt,
            status: vacancy.status || "draft",
            requestStatus: vacancy.requestStatus || "pending",
            salary: vacancy.salary || 0,
            experience: vacancy.experience || "Not specified",
            eduLevel: vacancy.eduLevel || "Not specified",
            endDate: vacancy.endDate || null,
            description: vacancy.description || "",
            justification: vacancy.justification || "",
            feedback: vacancy.feedback || ""
          }));
          
          setVacancyRequests(formattedVacancies);
        } else {
          console.error("Invalid response format:", response.data);
          setVacancyRequests([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vacancy requests:", err);
        setError("Failed to fetch vacancy requests. Please try again later.");
        setLoading(false);
      }
    };

    if (user) {
      fetchVacancyRequests();
    }
  }, [user]);

  // Helper to determine status display
  const getStatusBadge = (status, requestStatus) => {
    // Priority to requestStatus since it's the overall status of the vacancy request
    const displayStatus = requestStatus || status;
    
    switch (displayStatus) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaHourglassHalf className="mr-1" /> Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Vacancy Requests</h2>
        <Link
          to="/department-head-dashboard/request-vacancy"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Request New Position
        </Link>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      
      {/* DEBUG INFO - Remove in production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-xs">
          <details>
            <summary>Debug Information</summary>
            <pre>{JSON.stringify(debug, null, 2)}</pre>
          </details>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : vacancyRequests.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600 mb-4">You haven't submitted any vacancy requests yet.</p>
          <Link
            to="/department-head-dashboard/request-vacancy"
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Request Your First Position
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Requested
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requirements
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Feedback
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vacancyRequests.map((vacancy) => (
                <tr key={vacancy._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vacancy.position}</div>
                    <div className="text-sm text-gray-500">
                      ${vacancy.salary?.toLocaleString() || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vacancy.departmentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(vacancy.createdAt)}</div>
                    <div className="text-sm text-gray-500">
                      Deadline: {formatDate(vacancy.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(vacancy.status, vacancy.requestStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Experience: {vacancy.experience}</div>
                      <div>Education: {vacancy.eduLevel}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {vacancy.feedback || 
                       (vacancy.requestStatus === "pending" ? "Awaiting review" : "No feedback provided")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DepartmentVacancyRequests;

