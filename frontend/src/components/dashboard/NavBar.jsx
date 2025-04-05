"use client"
import { useAuth } from "../../context/authContext"
import { useNavigate } from "react-router-dom"

const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex items-center text-white justify-between h-12 bg-teal-600 px-5">
      <div className="flex items-center space-x-4">
        <p className="font-medium">Welcome, {user?.name}</p>
        <span className="text-sm bg-teal-700 px-2 py-1 rounded-full">
          {user?.role === "admin" ? "Admin" : user?.role === "department_head" ? "Department Head" : "Employee"}
        </span>
      </div>
      <button 
        onClick={handleLogout}
        className="px-4 py-1 bg-teal-700 hover:bg-teal-800 rounded-md transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  )
}

export default NavBar

