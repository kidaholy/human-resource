import { NavLink } from "react-router-dom"
import { FaCalendarAlt, FaFileAlt, FaMoneyBillWave, FaTachometerAlt, FaUser } from "react-icons/fa"

const EmployeeSideBar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <img src="/wolkite.png" alt="logo" width={"50"} /> <h1 className="text-lg font-pacifico">Wolkite University</h1>
      </div>
      <div>
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/profile"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaUser />
          <span>My Profile</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/request-leave"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaCalendarAlt />
          <span>Request Leave</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/leave-history"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaFileAlt />
          <span>Leave History</span>
        </NavLink>
        <NavLink
          to="/employee-dashboard/salary"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>
      </div>
    </div>
  )
}

export default EmployeeSideBar

