import { NavLink } from "react-router-dom"
import { FaCalendarAlt, FaFileAlt, FaInbox, FaTachometerAlt, FaUser, FaUsers } from "react-icons/fa"

const DepartmentHeadSideBar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <img src="/wolkite.png" alt="logo" width={"50"} /> <h1 className="text-lg font-pacifico">Wolkite University</h1>
      </div>
      <div>
        <NavLink
          to="/department-head-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/department-head-dashboard/profile"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaUser />
          <span>My Profile</span>
        </NavLink>
        <NavLink
          to="/department-head-dashboard/leave-requests"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaInbox />
          <span>Leave Requests</span>
        </NavLink>
        <NavLink
          to="/department-head-dashboard/request-leave"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaCalendarAlt />
          <span>Request Leave</span>
        </NavLink>
        <NavLink
          to="/department-head-dashboard/leave-history"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaFileAlt />
          <span>Leave History</span>
        </NavLink>
        <NavLink
          to="/department-head-dashboard/department-employees"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaUsers />
          <span>Department Employees</span>
        </NavLink>
      </div>
    </div>
  )
}

export default DepartmentHeadSideBar

