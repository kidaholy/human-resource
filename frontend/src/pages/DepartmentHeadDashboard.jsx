import { Outlet } from "react-router-dom"
import DepartmentHeadSideBar from "../components/dashboard/DepartmentHeadSideBar"
import NavBar from "../components/dashboard/NavBar"

const DepartmentHeadDashboard = () => {
  return (
    <div className="flex">
      <DepartmentHeadSideBar />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <NavBar />
        <Outlet />
      </div>
    </div>
  )
}

export default DepartmentHeadDashboard

