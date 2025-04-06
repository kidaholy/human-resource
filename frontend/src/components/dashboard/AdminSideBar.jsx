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
    <div className="bg-gray-800 text-white h-full w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          <li className="mb-2">
            <Link
              to="/admin-dashboard"
              className={`flex items-center p-2 rounded-md ${
                location.pathname === "/admin-dashboard" ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/employees"
              className={`flex items-center p-2 rounded-md ${
                isActive("/employees") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaUsers className="mr-3" />
              Employees
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/departments"
              className={`flex items-center p-2 rounded-md ${
                isActive("/departments") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaBuilding className="mr-3" />
              Departments
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/leave"
              className={`flex items-center p-2 rounded-md ${
                isActive("/leave") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaCalendarAlt className="mr-3" />
              Leave Management
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/salary/add"
              className={`flex items-center p-2 rounded-md ${
                isActive("/salary") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaMoneyBillWave className="mr-3" />
              Salary Management
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/profile"
              className={`flex items-center p-2 rounded-md ${
                isActive("/profile") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaUserTie className="mr-3" />
              My Profile
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/vacancies"
              className={`flex items-center p-2 rounded-md ${
                isActive("/vacancies") && !isActive("/vacancy-requests")
                  ? "bg-teal-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <FaBriefcase className="mr-3" />
              Vacancies
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/vacancy-requests"
              className={`flex items-center p-2 rounded-md ${
                isActive("/vacancy-requests") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaBriefcase className="mr-3" />
              Vacancy Requests
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin-dashboard/applicants"
              className={`flex items-center p-2 rounded-md ${
                isActive("/applicants") ? "bg-teal-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <FaUserGraduate className="mr-3" />
              Applicants
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSideBar

