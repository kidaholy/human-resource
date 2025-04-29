import { NavLink } from "react-router-dom"
import { FaCalendarAlt, FaFileAlt, FaMoneyBillWave, FaTachometerAlt, FaUser } from "react-icons/fa"

const EmployeeSideBar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-90 backdrop-blur-lg text-white h-screen fixed left-0 top-0 bottom-0 w-64 flex flex-col shadow-2xl rounded-r-lg">
      <div className="bg-teal-700 h-16 flex items-center justify-center shadow-md rounded-tr-lg">
        <img src="/wolkite.png" alt="logo" width={"50"} className="mr-2" />
        <h1 className="text-lg font-extrabold tracking-wide">Wolkite University</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:scale-105"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 text-sm font-medium transition-all duration-300`
          }
          end
        >
          <FaTachometerAlt className="text-lg" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/profile"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:scale-105"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 text-sm font-medium transition-all duration-300`
          }
          end
        >
          <FaUser className="text-lg" />
          <span>My Profile</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/request-leave"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:scale-105"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 text-sm font-medium transition-all duration-300`
          }
          end
        >
          <FaCalendarAlt className="text-lg" />
          <span>Request Leave</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/leave-history"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:scale-105"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 text-sm font-medium transition-all duration-300`
          }
          end
        >
          <FaFileAlt className="text-lg" />
          <span>Leave History</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/salary"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:scale-105"} 
            flex items-center space-x-4 py-3 px-6 rounded-md mx-2 mb-1 text-sm font-medium transition-all duration-300`
          }
          end
        >
          <FaMoneyBillWave className="text-lg" />
          <span>Salary History</span>
        </NavLink>
      </div>
      <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        <p>© 2023 Wolkite University</p>
        <p>Human Resource Management System</p>
      </div>
    </div>
  )
}

export default EmployeeSideBar
