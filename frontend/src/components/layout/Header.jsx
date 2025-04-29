"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import {
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
  FaMoon,
  FaSun,
  FaSearch,
  FaEnvelope,
  FaQuestionCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaCalendarCheck, // Added import
} from "react-icons/fa"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const [unreadMessages, setUnreadMessages] = useState(2)
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)
  const helpRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // You would implement actual dark mode toggling here
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
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
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Leave Approved",
      message: "Your leave request has been approved by the department head",
      time: "2 hours ago",
      isNew: true,
      type: "success",
    },
    {
      id: 2,
      title: "Salary Updated",
      message: "Your monthly salary has been processed and will be deposited soon",
      time: "1 day ago",
      isNew: false,
      type: "info",
    },
    {
      id: 3,
      title: "Document Required",
      message: "Please submit your updated CV for the annual records update",
      time: "3 days ago",
      isNew: false,
      type: "warning",
    },
  ]

  // Mock help topics
  const helpTopics = [
    { id: 1, title: "How to request leave?", link: "#" },
    { id: 2, title: "Viewing salary history", link: "#" },
    { id: 3, title: "Updating personal information", link: "#" },
    { id: 4, title: "Contact HR department", link: "#" },
  ]

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <FaCalendarCheck />
          </div>
        )
      case "warning":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <FaClipboardList />
          </div>
        )
      case "info":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <FaEnvelope />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <FaBell />
          </div>
        )
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-teal-700 to-teal-900 bg-opacity-95 backdrop-blur-lg text-white shadow-lg rounded-b-lg">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left side - Search */}
        <div className="hidden md:flex md:w-1/3">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </form>
        </div>

        {/* Mobile Logo */}
        <div className="flex items-center md:hidden">
          <img src="/wolkite.png" alt="logo" width="30" className="mr-2" />
          <span className="font-bold text-white tracking-wide">HRMS</span>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {/* Theme Toggle */}
          <button
            className="p-2 text-white hover:text-yellow-400 hover:bg-teal-700 rounded-full transition-all duration-300 shadow-md"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Help */}
          <div className="relative" ref={helpRef}>
            <button
              className="p-2 text-white hover:text-yellow-400 hover:bg-teal-700 rounded-full transition-all duration-300 shadow-md"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Help"
            >
              <FaQuestionCircle />
            </button>

            {showHelp && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium">Help Center</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-600 mb-2">Frequently asked questions</p>
                    <ul className="space-y-2">
                      {helpTopics.map((topic) => (
                        <li key={topic.id}>
                          <a
                            href={topic.link}
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                          >
                            <FaQuestionCircle className="mr-2 text-gray-400" />
                            {topic.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-4 py-2 text-center border-t border-gray-100">
                  <button className="text-xs text-primary-600 hover:text-primary-700">Contact Support</button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative">
            <button
              className="relative p-2 text-white hover:text-yellow-400 hover:bg-teal-700 rounded-full transition-all duration-300 shadow-md"
              aria-label="Messages"
            >
              <FaEnvelope />
              {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-md">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 text-white hover:text-yellow-400 hover:bg-teal-700 rounded-full transition-all duration-300 shadow-md"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <FaBell />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-md">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <span className="text-xs text-primary-600 cursor-pointer hover:text-primary-700">
                    Mark all as read
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.isNew ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start">
                        {getNotificationIcon(notification.type)}
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {notification.isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
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
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-all duration-300 p-1 rounded-lg hover:bg-teal-700 shadow-md"
            >
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white border border-teal-300">
                {user?.name?.charAt(0) || <FaUserCircle />}
              </div>
              <span className="hidden md:inline font-semibold">{user?.name}</span>
              <svg
                className="hidden md:inline w-4 h-4 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                  <div className="mt-2">
                    <span className={`text-xs ${getRoleBadgeColor(user?.role)} text-white px-2 py-1 rounded-full`}>
                      {formatRoleName(user?.role)}
                    </span>
                  </div>
                </div>
                <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaUserCircle className="mr-2 text-gray-500" />
                  My Profile
                </Link>
                <Link to="/calendar" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  My Calendar
                </Link>
                <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaCog className="mr-2 text-gray-500" />
                  Settings
                </Link>
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
