"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { FaBell, FaSignOutAlt, FaUserCircle, FaCog } from "react-icons/fa"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

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
        return "bg-primary-600"
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Mock notifications
  const notifications = [
    { id: 1, title: "Leave Approved", message: "Your leave request has been approved", time: "2 hours ago" },
    { id: 2, title: "Salary Updated", message: "Your salary has been updated", time: "1 day ago" },
    { id: 3, title: "New Announcement", message: "Check the new company announcement", time: "3 days ago" },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <img src="/wolkite.png" alt="logo" width="30" className="mr-2" />
          <span className="font-medium text-gray-800">HRMS</span>
        </div>

        <div className="hidden md:flex md:items-center md:space-x-4">
          <p className="font-medium text-gray-800">Welcome, {user?.name}</p>
          <span className={`text-xs ${getRoleBadgeColor(user?.role)} text-white px-2 py-1 rounded-full`}>
            {formatRoleName(user?.role)}
          </span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center border-t border-gray-100">
                  <button className="text-xs text-primary-600 hover:text-primary-700">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden md:inline">{user?.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                </div>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaUserCircle className="mr-2 text-gray-500" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaCog className="mr-2 text-gray-500" />
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
    </header>
  )
}

export default Header

