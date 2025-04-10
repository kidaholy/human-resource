"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import DataTable from "react-data-table-component"
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa"

const ManageApplicants = () => {
  const [applicants, setApplicants] = useState([])
  const [filteredApplicants, setFilteredApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [vacancies, setVacancies] = useState([])
  const [selectedVacancy, setSelectedVacancy] = useState("")
  const [processingId, setProcessingId] = useState(null)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [currentApplicant, setCurrentApplicant] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [actionType, setActionType] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [applicantToDelete, setApplicantToDelete] = useState(null)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/applicants/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setApplicants(response.data.applications)
          setFilteredApplicants(response.data.applications)
        } else {
          // If API doesn't return success, use mock data
          const mockData = [
            {
              _id: "app1",
              fullName: "John Smith",
              email: "john.smith@example.com",
              phone: "+1234567890",
              vacancy: {
                _id: "vac1",
                position: "Senior Lecturer",
                department: { dep_name: "Computer Science" },
              },
              status: "pending",
              applicationDate: "2023-06-15T10:30:00Z",
              feedback: "",
            },
            {
              _id: "app2",
              fullName: "Jane Doe",
              email: "jane.doe@example.com",
              phone: "+1234567891",
              vacancy: {
                _id: "vac2",
                position: "Assistant Professor",
                department: { dep_name: "Electrical Engineering" },
              },
              status: "shortlisted",
              applicationDate: "2023-05-20T14:45:00Z",
              feedback: "Your application has been shortlisted. We will contact you for an interview soon.",
            },
          ]
          setApplicants(mockData)
          setFilteredApplicants(mockData)
        }

        // Fetch vacancies for filter
        const vacanciesResponse = await axios.get("http://localhost:5000/api/vacancies", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (vacanciesResponse.data.success) {
          setVacancies(vacanciesResponse.data.vacancies)
        } else {
          // Mock vacancies data
          setVacancies([
            { _id: "vac1", position: "Senior Lecturer", department: { dep_name: "Computer Science" } },
            { _id: "vac2", position: "Assistant Professor", department: { dep_name: "Electrical Engineering" } },
            { _id: "vac3", position: "Lab Assistant", department: { dep_name: "Computer Science" } },
          ])
        }
      } catch (error) {
        console.error("Error fetching applicants:", error)
        setError("Failed to load applicants. Please try again later.")

        // Use mock data if API fails
        const mockData = [
          {
            _id: "app1",
            fullName: "John Smith",
            email: "john.smith@example.com",
            phone: "+1234567890",
            vacancy: {
              _id: "vac1",
              position: "Senior Lecturer",
              department: { dep_name: "Computer Science" },
            },
            status: "pending",
            applicationDate: "2023-06-15T10:30:00Z",
            feedback: "",
          },
          {
            _id: "app2",
            fullName: "Jane Doe",
            email: "jane.doe@example.com",
            phone: "+1234567891",
            vacancy: {
              _id: "vac2",
              position: "Assistant Professor",
              department: { dep_name: "Electrical Engineering" },
            },
            status: "shortlisted",
            applicationDate: "2023-05-20T14:45:00Z",
            feedback: "Your application has been shortlisted. We will contact you for an interview soon.",
          },
        ]
        setApplicants(mockData)
        setFilteredApplicants(mockData)

        // Mock vacancies data
        setVacancies([
          { _id: "vac1", position: "Senior Lecturer", department: { dep_name: "Computer Science" } },
          { _id: "vac2", position: "Assistant Professor", department: { dep_name: "Electrical Engineering" } },
          { _id: "vac3", position: "Lab Assistant", department: { dep_name: "Computer Science" } },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [])

  useEffect(() => {
    // Apply filters
    let results = [...applicants]

    // Filter by status
    if (filterStatus !== "all") {
      results = results.filter((applicant) => applicant.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (applicant) =>
          (applicant.fullName?.toLowerCase().includes(term) || false) ||
          (applicant.email?.toLowerCase().includes(term) || false) ||
          (applicant.vacancy?.position?.toLowerCase().includes(term) || false)
      )
    }

    // Filter by vacancy
    if (selectedVacancy) {
      results = results.filter((applicant) => applicant.vacancy?._id === selectedVacancy)
    }

    setFilteredApplicants(results)
  }, [applicants, filterStatus, selectedVacancy, searchTerm])

  const handleStatusChange = async (applicantId, newStatus) => {
    setProcessingId(applicantId)

    try {
      const response = await axios.put(
        `http://localhost:5000/api/applicants/${applicantId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        // Update local state
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) => (app._id === applicantId ? { ...app, status: newStatus } : app)),
        )
      }
    } catch (error) {
      console.error("Error updating applicant status:", error)
      alert("Failed to update applicant status. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  const openFeedbackModal = (applicant, action) => {
    setCurrentApplicant(applicant)
    setActionType(action)
    setFeedback("")
    setShowFeedbackModal(true)
  }

  const submitFeedback = async () => {
    if (!currentApplicant || !actionType) return

    const newStatus =
      actionType === "shortlist"
        ? "shortlisted"
        : actionType === "select"
          ? "selected"
          : actionType === "reject"
            ? "rejected"
            : "pending"

    setProcessingId(currentApplicant._id)

    try {
      const response = await axios.put(
        `http://localhost:5000/api/applicants/${currentApplicant._id}/status`,
        {
          status: newStatus,
          feedback: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.data.success) {
        // Update local state
        setApplicants((prevApplicants) =>
          prevApplicants.map((app) =>
            app._id === currentApplicant._id ? { ...app, status: newStatus, feedback } : app,
          ),
        )
        setShowFeedbackModal(false)
      }
    } catch (error) {
      console.error("Error updating applicant status:", error)
      alert("Failed to update applicant status. Please try again.")
    } finally {
      setProcessingId(null)
    }
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

  const handleDelete = async (applicantId) => {
    setProcessingId(applicantId);
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/applicants/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        // Remove the applicant from state
        setApplicants(prevApplicants => 
          prevApplicants.filter(app => app._id !== applicantId)
        );
        setShowDeleteConfirmation(false);
        setApplicantToDelete(null);
      } else {
        alert("Failed to delete application. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const openDeleteConfirmation = (applicant) => {
    setApplicantToDelete(applicant);
    setShowDeleteConfirmation(true);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.vacancy?.position || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.vacancy?.department?.dep_name || "N/A",
      sortable: true,
    },
    {
      name: "Education",
      selector: (row) => row.education?.degree || "N/A",
      sortable: true,
      cell: (row) => (
        <div>
          <div>{row.education?.degree || "N/A"}</div>
          <div className="text-xs text-gray-500">{row.education?.institution || "N/A"}</div>
        </div>
      ),
    },
    {
      name: "Applied On",
      selector: (row) => row.applicationDate ? new Date(row.applicationDate).toLocaleDateString() : "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "pending",
      sortable: true,
      cell: (row) => getStatusBadge(row.status || "pending"),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin-dashboard/applicants/${row._id}`}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <FaEye />
          </Link>
              <button
            onClick={() => handleStatusChange(row._id, "shortlisted")}
                className="text-blue-600 hover:text-blue-800"
                title="Shortlist"
              >
                <FaCheck />
              </button>
              <button
            onClick={() => handleStatusChange(row._id, "rejected")}
                className="text-red-600 hover:text-red-800"
                title="Reject"
              >
                <FaTimes />
              </button>
          <button
            onClick={() => openFeedbackModal(row, "feedback")}
            className="text-teal-600 hover:text-teal-800"
            title="Add Feedback"
          >
            <FaEdit />
          </button>
            <button
            onClick={() => openDeleteConfirmation(row)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FaTrash />
            </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Applicants</h2>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaFilter className="text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold">Filter Applicants</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={selectedVacancy}
              onChange={(e) => setSelectedVacancy(e.target.value)}
              className="py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Positions</option>
              {vacancies.map((vacancy) => (
                <option key={vacancy._id} value={vacancy._id}>
                  {vacancy.position} - {vacancy.department?.dep_name || "Unknown Department"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <DataTable
            columns={columns}
            data={filteredApplicants}
            pagination
            highlightOnHover
            responsive
            noDataComponent={
              <div className="p-6 text-center">
                <p className="text-gray-500">No applicants found matching your criteria</p>
              </div>
            }
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && applicantToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Application</h3>
            <p className="mb-4">
              Are you sure you want to delete the application from <strong>{applicantToDelete.fullName}</strong> for the position of <strong>{applicantToDelete.vacancy?.position || "Unknown Position"}</strong>?
            </p>
            <p className="mb-4 text-red-600">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(applicantToDelete._id)}
                disabled={processingId === applicantToDelete._id}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                {processingId === applicantToDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {actionType === "shortlist"
                ? "Shortlist Applicant"
                : actionType === "select"
                  ? "Select Applicant"
                  : "Reject Application"}
            </h3>
            <p className="mb-4">
              {actionType === "shortlist"
                ? "Provide feedback for shortlisting"
                : actionType === "select"
                  ? "Provide feedback for selection"
                  : "Provide reason for rejection"}
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter your feedback here..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className={`px-4 py-2 text-white rounded-md ${
                  actionType === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageApplicants

