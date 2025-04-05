import { NavLink } from "react-router-dom"
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
} from "react-icons/fa"

const AdminSideBar = () => {
  return (
    <div className="bg-gray-900 text-white h-screen fixed left-0 top-0 bottom-0 w-64 flex flex-col transition-all duration-300 shadow-lg">
      <div className="bg-teal-700 h-16 flex items-center justify-center">
        <img src="/wolkite.png" alt="logo" width={"50"} className="mr-2" />
        <h1 className="text-lg font-pacifico">Wolkite University</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaTachometerAlt className="text-lg" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaUsers className="text-lg" />
          <span>Employees</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaBuilding className="text-lg" />
          <span>Departments</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/leave"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaCalendarAlt className="text-lg" />
          <span>Leave</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/salary/add"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaMoneyBillWave className="text-lg" />
          <span>Salary</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/vacancies"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaBriefcase className="text-lg" />
          <span>Vacancies</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/setting"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 transition-colors duration-200`
          }
          end
        >
          <FaCogs className="text-lg" />
          <span>Settings</span>
        </NavLink>
      </div>
      <div className="p-4 text-xs text-gray-400 border-t border-gray-800">
        <p>© 2023 Wolkite University</p>
        <p>Human Resource Management System</p>
      </div>
    </div>
  )
}

export default AdminSideBar

