import { NavLink } from "react-router-dom"
import { FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaUsers } from "react-icons/fa"

const AdminSideBar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <img src="/wolkite.png" alt="logo" width={"50"} /> <h1 className="text-lg font-pacifico">Wolkite University</h1>
      </div>
      <div>
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaUsers />
          <span>Employee</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaBuilding />
          <span>Department</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/leave"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaCalendarAlt />
          <span>Leave</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/salary/add"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>
        <NavLink
          to="/admin-dashboard/setting"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : " "} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <FaCogs />
          <span>Setting</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSideBar

