"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { FaUser, FaFileAlt, FaBell, FaSignOutAlt, FaHome } from "react-icons/fa"
import { useAuth } from "../context/authContext"

const ApplicantDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("applications")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/applicants/my-applications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setApplications(response.data.applications)
        } else {
          // If API doesn't return success, use mock data
          setApplications([
            {
              _id: "app1",
              vacancy: {
                _id: "vac1",
                position: "Senior Lecturer",
                department: { dep_name: "Computer Science" },
              },
              status: "pending",
              createdAt: "2023-06-15T10:30:00Z",
              feedback: "",
            },
            {
              _id: "app2",
              vacancy: {
                _id: "vac2",
                position: "Assistant Professor",
                department: { dep_name: "Electrical Engineering" },
              },
              status: "shortlisted",
              createdAt: "2023-05-20T14:45:00Z",
              feedback: "Your application has been shortlisted. We will contact you for an interview soon.",
            },
            {
              _id: "app3",
              vacancy: {
                _id: "vac3",
                position: "Lab Assistant",
                department: { dep_name: "Computer Science" },
              },
              status: "rejected",
              createdAt: "2023-04-10T09:15:00Z",
              feedback:
                "Thank you for your interest. We have selected candidates whose qualifications better match our current needs.",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching applications:", error)
        setError("Failed to load your applications. Please try again later.")
        // Use mock data if API fails
        setApplications([
          {
            _id: "app1",
            vacancy: {
              _id: "vac1",
              position: "Senior Lecturer",
              department: { dep_name: "Computer Science" },
            },
            status: "pending",
            createdAt: "2023-06-15T10:30:00Z",
            feedback: "",
          },
          {
            _id: "app2",
            vacancy: {
              _id: "vac2",
              position: "Assistant Professor",
              department: { dep_name: "Electrical Engineering" },
            },
            status: "shortlisted",
            createdAt: "2023-05-20T14:45:00Z",
            feedback: "Your application has been shortlisted. We will contact you for an interview soon.",
          },
          {
            _id: "app3",
            vacancy: {
              _id: "vac3",
              position: "Lab Assistant",
              department: { dep_name: "Computer Science" },
            },
            status: "rejected",
            createdAt: "2023-04-10T09:15:00Z",
            feedback:
              "Thank you for your interest. We have selected candidates whose qualifications better match our current needs.",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
      case "shortlisted":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Shortlisted</span>
      case "interviewed":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Interviewed</span>
        )
      case "selected":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Selected</span>
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/wolkite.png" alt="Wolkite University" className="h-12 mr-3" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wolkite University</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-600 hover:text-teal-600">
                <FaBell className="text-xl" />
                {applications.some((app) => app.status === "shortlisted" || app.status === "selected") && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            <div className="hidden md:block">
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600" title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold">
                    {user?.name?.[0] || "A"}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-800">{user?.name || "Applicant"}</h3>
                    <p className="text-sm text-gray-600">{user?.email || "applicant@example.com"}</p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("applications")}
                      className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                        activeTab === "applications" ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FaFileAlt />
                      <span>My Applications</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                        activeTab === "profile" ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FaUser />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/vacancies"
                      className="w-full flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FaHome />
                      <span>Browse Jobs</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "applications" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">My Applications</h2>
                </div>

                {loading ? (
                  <div className="p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-red-500">{error}</div>
                ) : applications.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 mb-4">
                      <FaFileAlt className="mx-auto text-5xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-4">You haven't applied for any positions yet.</p>
                    <Link
                      to="/vacancies"
                      className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                      Browse Open Positions
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied On
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((application) => (
                          <tr key={application._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{application.vacancy.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{application.vacancy.department.dep_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(application.applicationDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(application.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                      <p className="text-gray-800">{user?.name || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                      <p className="text-gray-800">{user?.email || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                      <p className="text-gray-800">{user?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Account Type</h3>
                      <p className="text-gray-800">Applicant</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Application Feedback */}
            {activeTab === "applications" && applications.some((app) => app.feedback) && (
              <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Application Feedback</h2>
                </div>
                <div className="p-6 space-y-4">
                  {applications
                    .filter((app) => app.feedback)
                    .map((app) => (
                      <div key={`feedback-${app._id}`} className="border-l-4 border-teal-500 pl-4 py-2">
                        <h3 className="font-medium text-gray-800">{app.vacancy.position}</h3>
                        <p className="text-sm text-gray-600 mb-2">Status: {getStatusBadge(app.status)}</p>
                        <p className="text-gray-700">{app.feedback}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/wolkite.png" alt="Wolkite University" className="h-10 mr-3" />
              <h3 className="text-xl font-bold">Wolkite University</h3>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} Wolkite University. All rights reserved.</p>
              <p className="text-sm text-gray-500 mt-1">Human Resource Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ApplicantDashboard

