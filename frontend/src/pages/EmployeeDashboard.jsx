import { Outlet } from "react-router-dom"
import EmployeeSideBar from "../components/dashboard/EmployeeSideBar"
import NavBar from "../components/dashboard/NavBar"

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <EmployeeSideBar />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <NavBar />
        <Outlet />
      </div>
    </div>
  )
}

export default EmployeeDashboard

