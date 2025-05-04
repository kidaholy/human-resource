import { Link, useLocation } from "react-router-dom"
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaUserTie,
  FaMoneyBillWave,
  FaBriefcase,
  FaUserPlus,
  FaChartBar,
  FaSitemap,
} from "react-icons/fa"

const AdminSideBar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path === "/admin-dashboard/org-chart" && location.pathname === "/admin-dashboard/organization-chart") ||
      (path === "/admin-dashboard/organization-chart" && location.pathname === "/admin-dashboard/org-chart")
    )
  }

  return (
    <div className="bg-gray-800 text-white h-full w-64 fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin-dashboard"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/departments"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/departments") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaBuilding className="mr-3" />
              Departments
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/employees"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/employees") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaUsers className="mr-3" />
              Employees
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/salary/add"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/salary/add") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaMoneyBillWave className="mr-3" />
              Salary Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/leave"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/leave") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaUserTie className="mr-3" />
              Leave Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/vacancies"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/vacancies") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaBriefcase className="mr-3" />
              Vacancy Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/applicants"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/applicants") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaUserPlus className="mr-3" />
              Applicants
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/vacancy-requests"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/vacancy-requests") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaChartBar className="mr-3" />
              Vacancy Requests
            </Link>
          </li>
          <li>
            <Link
              to="/admin-dashboard/org-chart"
              className={`flex items-center p-2 rounded-lg ${
                isActive("/admin-dashboard/org-chart") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <FaSitemap className="mr-3" />
              Organization Chart
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSideBar
