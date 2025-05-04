import { FaArrowLeft } from "react-icons/fa"
import { Link } from "react-router-dom"
import OrganizationalChart from "../components/charts/OrganizationalChart"

const OrganizationChartPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <Link to="/admin-dashboard" className="flex items-center text-teal-600 hover:text-teal-800 mr-4">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">University Organizational Chart</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-6">
          This chart displays the organizational structure of Wolkite University, showing all departments, department
          heads, and employees. Use the search function to find specific departments or employees.
        </p>

        <OrganizationalChart />
      </div>
    </div>
  )
}

export default OrganizationChartPage
