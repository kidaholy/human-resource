"use client"

import AdminSideBar from "../components/dashboard/AdminSideBar.jsx"
import NavBar from "../components/dashboard/NavBar.jsx"
import { useAuth } from "../context/authContext.jsx"
AdminSideBar
import { Outlet } from "react-router-dom"

function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="flex">
      <AdminSideBar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <NavBar />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard

