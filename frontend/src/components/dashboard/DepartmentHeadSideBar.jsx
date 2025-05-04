import { Link, useLocation } from "react-router-dom"
import { FaHome, FaUsers, FaUserTie, FaBriefcase, FaChartBar, FaSitemap } from "react-icons/fa"

const DepartmentHeadSideBar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="bg-gray-800 text-white h-full w-64 fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Department Head Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/department-head/dashboard"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/department-head/dashboard") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/department-head/employees"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/department-head/employees") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaUsers className="mr-3" />
              Employees
            </Link>
          </li>
          <li>
            <Link
              to="/department-head/leave"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/department-head/leave") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaUserTie className="mr-3" />
              Leave Management
            </Link>
          </li>
          <li>
            <Link
              to="/department-head/vacancy-requests"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/department-head/vacancy-requests") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaBriefcase className="mr-3" />
              Vacancy Requests
            </Link>
          </li>
          <li>
            <Link
              to="/department-head/reports"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/department-head/reports") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaChartBar className="mr-3" />
              Reports
            </Link>
          </li>
          <li>
            <Link
              to="/department-head/organization-chart"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/department-head/organization-chart") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaSitemap className="mr-3" />
              Department Structure
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DepartmentHeadSideBar
