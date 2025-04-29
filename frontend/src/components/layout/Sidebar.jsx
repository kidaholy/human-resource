"use client"

import { useState, useEffect } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import {
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChartBar,
  FaClipboardList,
  FaGraduationCap,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

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

  // Auto-expand section based on current route
  useEffect(() => {
    const currentPath = location.pathname

    // Find which section contains the current path
    const findSection = (links) => {
      for (const link of links) {
        if (link.section) {
          const subLink = link.subLinks.find(
            (sub) => currentPath === sub.path || currentPath.startsWith(`${sub.path}/`),
          )
          if (subLink) {
            return link.section
          }
        }
      }
      return null
    }

    const section = findSection(
      user?.role === "admin" ? adminLinks : user?.role === "department_head" ? departmentHeadLinks : employeeLinks,
    )

    if (section) {
      setExpandedSection(section)
    }
  }, [location.pathname, user?.role])

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const adminLinks = [
    { path: "/admin-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    {
      section: "staff",
      icon: <FaUsers />,
      label: "Staff Management",
      subLinks: [
        { path: "/admin-dashboard/employees", label: "All Employees" },
        { path: "/admin-dashboard/departments", label: "Departments" },
        { path: "/admin-dashboard/org-chart", label: "Organization Chart" },
      ],
    },
    {
      section: "operations",
      icon: <FaCalendarAlt />,
      label: "Operations",
      subLinks: [
        { path: "/admin-dashboard/leave", label: "Leave Management" },
        { path: "/admin-dashboard/salary/add", label: "Salary Management" },
        { path: "/admin-dashboard/attendance", label: "Attendance" },
      ],
    },
    {
      section: "recruitment",
      icon: <FaBriefcase />,
      label: "Recruitment",
      subLinks: [
        { path: "/admin-dashboard/vacancies", label: "Active Vacancies" },
        { path: "/admin-dashboard/vacancy-requests", label: "Vacancy Requests" },
        { path: "/admin-dashboard/applicants", label: "Applicants" },
        { path: "/admin-dashboard/interviews", label: "Interviews" },
      ],
    },
    {
      section: "reports",
      icon: <FaChartBar />,
      label: "Reports",
      subLinks: [
        { path: "/admin-dashboard/reports/employees", label: "Employee Reports" },
        { path: "/admin-dashboard/reports/leave", label: "Leave Reports" },
        { path: "/admin-dashboard/reports/salary", label: "Salary Reports" },
      ],
    },
    { path: "/admin-dashboard/setting", icon: <FaCogs />, label: "Settings" },
  ]

  const departmentHeadLinks = [
    { path: "/department-head-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/department-head-dashboard/profile", icon: <FaUser />, label: "My Profile" },
    {
      section: "team",
      icon: <FaUsers />,
      label: "My Team",
      subLinks: [
        { path: "/department-head-dashboard/department-employees", label: "Department Staff" },
        { path: "/department-head-dashboard/leave-requests", label: "Leave Requests" },
        { path: "/department-head-dashboard/performance", label: "Performance" },
      ],
    },
    {
      section: "personal",
      icon: <FaCalendarAlt />,
      label: "Personal",
      subLinks: [
        { path: "/department-head-dashboard/request-leave", label: "Request Leave" },
        { path: "/department-head-dashboard/leave-history", label: "Leave History" },
        { path: "/department-head-dashboard/salary-history", label: "Salary History" },
      ],
    },
    {
      section: "vacancies",
      icon: <FaBriefcase />,
      label: "Vacancies",
      subLinks: [
        { path: "/department-head-dashboard/my-vacancy-requests", label: "My Requests" },
        { path: "/department-head-dashboard/request-vacancy", label: "Request New" },
        { path: "/department-head-dashboard/interviews", label: "Interviews" },
      ],
    },
    {
      section: "reports",
      icon: <FaChartBar />,
      label: "Reports",
      subLinks: [
        { path: "/department-head-dashboard/reports/department", label: "Department Reports" },
        { path: "/department-head-dashboard/reports/attendance", label: "Attendance Reports" },
      ],
    },
  ]

  const employeeLinks = [
    { path: "/employee-dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/employee-dashboard/profile", icon: <FaUser />, label: "My Profile" },
    { path: "/employee-dashboard/request-leave", icon: <FaCalendarAlt />, label: "Request Leave" },
    { path: "/employee-dashboard/leave-history", icon: <FaFileAlt />, label: "Leave History" },
    { path: "/employee-dashboard/salary", icon: <FaMoneyBillWave />, label: "Salary History" },
    { path: "/employee-dashboard/documents", icon: <FaClipboardList />, label: "Documents" },
    { path: "/employee-dashboard/training", icon: <FaGraduationCap />, label: "Training" },
  ]

  const links =
    user?.role === "admin" ? adminLinks : user?.role === "department_head" ? departmentHeadLinks : employeeLinks

  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const isSectionActive = (section) => {
    const sectionLinks = links.find((link) => link.section === section)?.subLinks || []
    return sectionLinks.some((link) => isPathActive(link.path))
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        className="fixed z-50 bottom-6 right-6 md:hidden bg-primary-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
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
          md:translate-x-0 bg-gradient-to-b from-teal-700 to-teal-900 bg-opacity-95 backdrop-blur-lg text-white w-72 md:w-72 flex flex-col shadow-2xl rounded-r-lg`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-teal-800 text-white shadow-md rounded-tr-lg">
          <img src="/wolkite.png" alt="logo" width="40" className="mr-2" />
          <h1 className="text-lg font-extrabold tracking-wide">Wolkite University</h1>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border border-primary-200">
                {user?.name?.charAt(0) || <FaUser />}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {user?.role === "admin" ? "Admin" : user?.role === "department_head" ? "Department Head" : "Employee"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {links.map((link, index) => (
              <li key={link.path || link.section}>
                {link.section ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleSection(link.section)}
                      className={`w-full sidebar-link flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        isSectionActive(link.section)
                          ? "bg-teal-600 text-white shadow-lg"
                          : "hover:bg-teal-700 hover:scale-105"
                      }`}
                      aria-expanded={expandedSection === link.section}
                      aria-controls={`submenu-${link.section}`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="flex-1 text-left">{link.label}</span>
                      <FaChevronRight
                        className={`transition-transform duration-200 ${
                          expandedSection === link.section ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    <div
                      id={`submenu-${link.section}`}
                      className={`overflow-hidden transition-all duration-200 pl-9 ${
                        expandedSection === link.section || isSectionActive(link.section) ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <ul className="mt-1 space-y-1">
                        {link.subLinks.map((subLink) => (
                          <li key={subLink.path}>
                            <NavLink
                              to={subLink.path}
                              end={subLink.path.split("/").length <= 2}
                              className={({ isActive }) =>
                                `block py-2 px-3 text-sm rounded-md transition-colors ${
                                  isActive
                                    ? "bg-primary-50 text-primary-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                              }
                            >
                              {subLink.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    end={link.path.split("/").length <= 2}
                    className={({ isActive }) =>
                      `sidebar-link flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-teal-600 text-white shadow-lg"
                          : "hover:bg-teal-700 hover:scale-105"
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button className="w-full flex items-center py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <FaQuestionCircle className="mr-2 text-gray-500" />
              Help & Support
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center py-2 px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="p-4 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
          <p>© {new Date().getFullYear()} Wolkite University</p>
          <p>Human Resource Management System v1.2.0</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
