"use client"
import { FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import OrganizationalChart from "../components/charts/OrganizationalChart"

const DepartmentHeadOrgChart = () => {
  const { user } = useAuth()
  const departmentId = user?.employee?.department

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <Link to="/department-head-dashboard" className="flex items-center text-teal-600 hover:text-teal-800 mr-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Department Organizational Chart</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6">
          This chart displays the organizational structure of your department, showing the department head and all
          employees. Use the search function to find specific employees.
        </p>

        <OrganizationalChart departmentId={departmentId} />
      </div>
    </div>
  )
}

export default DepartmentHeadOrgChart
