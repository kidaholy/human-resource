"use client"
import { useAuth } from "../../context/authContext"
import { useNavigate } from "react-router-dom"
import { FaBell, FaSignOutAlt, FaUserCircle } from "react-icons/fa"
import { useState } from "react"

const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-600"
      case "department_head":
        return "bg-blue-600"
      default:
        return "bg-teal-700"
    }
  }

  const formatRoleName = (role) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "department_head":
        return "Department Head"
      default:
        return "Employee"
    }
  }

  return (
    <div className="flex items-center justify-between h-16 bg-white px-6 border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <p className="font-medium text-gray-800">Welcome, {user?.name}</p>
        <span className={`text-xs ${getRoleBadgeColor(user?.role)} text-white px-2 py-1 rounded-full`}>
          {formatRoleName(user?.role)}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded-full transition-colors">
          <FaBell />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors"
          >
            <FaUserCircle className="text-2xl" />
            <span className="hidden md:inline">{user?.name}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar

