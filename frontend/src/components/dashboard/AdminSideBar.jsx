import { Link, useLocation } from "react-router-dom"
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaBriefcase,
  FaUserGraduate,
} from "react-icons/fa"

const AdminSideBar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-700 bg-opacity-90 backdrop-blur-lg text-white h-full w-64 fixed left-0 top-0 overflow-y-auto shadow-2xl rounded-r-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          <li className="mb-2">
            <Link
              to="/admin-dashboard"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                location.pathname === "/admin-dashboard"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/employees"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/employees")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaUsers className="mr-3" />
              Employees
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/departments"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/departments")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaBuilding className="mr-3" />
              Departments
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/leave"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/leave")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaCalendarAlt className="mr-3" />
              Leave Management
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/salary/add"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/salary")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaMoneyBillWave className="mr-3" />
              Salary Management
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/profile"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/profile")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaUserTie className="mr-3" />
              My Profile
            </Link>
          </li>

          {/* Vacancy Management Section */}
          <li className="mt-6 mb-2">
            <h3 className="text-lg font-semibold text-gray-300 px-2">Vacancy Management</h3>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/vacancies"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/vacancies") && !isActive("/vacancy-requests")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaBriefcase className="mr-3" />
              Active Vacancies
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/vacancy-requests"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/vacancy-requests")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaBriefcase className="mr-3" />
              Vacancy Requests
            </Link>
          </li>

          {/* Applicant Management Section */}
          <li className="mt-6 mb-2">
            <h3 className="text-lg font-semibold text-gray-300 px-2">Applicant Management</h3>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/applicants"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/applicants")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaUserGraduate className="mr-3" />
              All Applicants
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSideBar

