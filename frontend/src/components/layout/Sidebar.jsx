"use client"

import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaInbox,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar")
      const toggleButton = document.getElementById("sidebar-toggle")

      if (isOpen && sidebar && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const adminLinks = [
    { path: "/admin-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/admin-dashboard/employees", icon: <FaUsers />, label: "Employees" },
    { path: "/admin-dashboard/departments", icon: <FaBuilding />, label: "Departments" },
    { path: "/admin-dashboard/leave", icon: <FaCalendarAlt />, label: "Leave" },
    { path: "/admin-dashboard/salary/add", icon: <FaMoneyBillWave />, label: "Salary" },
    { path: "/admin-dashboard/vacancies", icon: <FaBriefcase />, label: "Vacancies" },
    { path: "/admin-dashboard/vacancy-requests", icon: <FaInbox />, label: "Vacancy Requests" },
    { path: "/admin-dashboard/applicants", icon: <FaFileAlt />, label: "Applicants" },
    { path: "/admin-dashboard/setting", icon: <FaCogs />, label: "Settings" },
  ]

  const departmentHeadLinks = [
    { path: "/department-head-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/department-head-dashboard/profile", icon: <FaUser />, label: "My Profile" },
    { path: "/department-head-dashboard/leave-requests", icon: <FaInbox />, label: "Leave Requests" },
    { path: "/department-head-dashboard/request-leave", icon: <FaCalendarAlt />, label: "Request Leave" },
    { path: "/department-head-dashboard/leave-history", icon: <FaFileAlt />, label: "Leave History" },
    { path: "/department-head-dashboard/department-employees", icon: <FaUsers />, label: "Department Employees" },
    { path: "/department-head-dashboard/my-vacancy-requests", icon: <FaBriefcase />, label: "My Vacancy Requests" },
    { path: "/department-head-dashboard/request-vacancy", icon: <FaBriefcase />, label: "Request New Vacancy" },
  ]

  const employeeLinks = [
    { path: "/employee-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/employee-dashboard/profile", icon: <FaUser />, label: "My Profile" },
    { path: "/employee-dashboard/request-leave", icon: <FaCalendarAlt />, label: "Request Leave" },
    { path: "/employee-dashboard/leave-history", icon: <FaFileAlt />, label: "Leave History" },
    { path: "/employee-dashboard/salary", icon: <FaMoneyBillWave />, label: "Salary" },
  ]

  const links =
    user?.role === "admin" ? adminLinks : user?.role === "department_head" ? departmentHeadLinks : employeeLinks

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        className="fixed z-50 bottom-4 right-4 md:hidden bg-primary-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" />}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 bg-white border-r border-gray-200 w-64 md:w-72`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-primary-600 text-white">
            <img src="/wolkite.png" alt="logo" width="40" className="mr-2" />
            <h1 className="text-lg font-medium">Wolkite University</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path.split("/").length <= 2}
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
            <p>© 2023 Wolkite University</p>
            <p>Human Resource Management System</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

