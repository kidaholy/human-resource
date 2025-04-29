import { Link, useLocation } from "react-router-dom"
import { FaHome, FaUsers, FaCalendarAlt, FaUserTie, FaBriefcase, FaPlus } from "react-icons/fa"

const DepartmentHeadSideBar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-700 bg-opacity-90 backdrop-blur-lg text-white h-full w-64 fixed left-0 top-0 overflow-y-auto shadow-2xl rounded-r-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Department Head</h2>
        <ul>
          <li className="mb-2">
            <Link
              to="/department-head-dashboard"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                location.pathname === "/department-head-dashboard"
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
              to="/department-head-dashboard/department-employees"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/department-employees")
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
              to="/department-head-dashboard/leave-requests"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/leave-requests")
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
              to="/department-head-dashboard/profile"
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

          {/* Vacancy Management Section with clear heading */}
          <li className="mt-6 mb-2">
            <h3 className="text-lg font-semibold text-gray-300 px-2">Vacancy Management</h3>
          </li>
          <li className="mb-2">
            <Link
              to="/department-head-dashboard/my-vacancy-requests"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/my-vacancy-requests")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <FaBriefcase className="mr-3" />
              My Vacancy Requests
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/department-head-dashboard/request-vacancy"
              className={`flex items-center p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/request-vacancy")
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-yellow-600 text-white hover:bg-yellow-700 hover:scale-105"
              }`}
            >
              <FaPlus className="mr-3" />
              Request New Vacancy
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DepartmentHeadSideBar

