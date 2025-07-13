"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaBuilding,
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaBriefcase,
  FaArrowRight,
  FaMoneyBillWave,
  FaGraduationCap,
  FaSearch,
  FaChevronDown,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa"
import axios from "axios"

const Welcome = () => {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try to fetch featured vacancies first
        const response = await axios.get("https://human-resource-5qve.onrender.com/api/vacancies/public")

        if (response.data.success) {
          // Limit to 3 most recent vacancies for the featured section
          const featuredVacancies = response.data.vacancies
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)

          setVacancies(featuredVacancies)
        } else {
          throw new Error("Failed to fetch vacancies")
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error)
        setError("Unable to load job openings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/wolkite.png" alt="Wolkite University" className="h-12 mr-3" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wolkite University</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/vacancies" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
                Careers
              </Link>
              <div className="relative group">
                <button className="flex items-center text-gray-800 hover:text-primary-600 font-medium transition-colors">
                  About <FaChevronDown className="ml-1 h-3 w-3" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Our University
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Leadership
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Departments
                  </a>
                </div>
              </div>
              <Link to="/register" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
                Register
              </Link>
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
            </nav>

            <div className="md:hidden">
              <button
                className="text-gray-800 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-800 hover:text-primary-600 font-medium">
                  Home
                </Link>
                <Link to="/vacancies" className="text-gray-800 hover:text-primary-600 font-medium">
                  Careers
                </Link>
                <button className="flex items-center justify-between text-gray-800 hover:text-primary-600 font-medium">
                  About
                  <FaChevronDown className="h-3 w-3" />
                </button>
                <Link to="/register" className="text-gray-800 hover:text-primary-600 font-medium">
                  Register
                </Link>
                <Link to="/login" className="text-gray-800 hover:text-primary-600 font-medium">
                  Login
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="bg-cover bg-center py-20 md:py-32 relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/wolkite-uni.png')",
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Human Resource Management System
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Join our team at Wolkite University and be part of our mission to provide quality education and research.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vacancies"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              <FaBriefcase className="mr-2" /> View Open Positions
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-primary-600 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              <FaSignInAlt className="mr-2" /> Employee Login
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-12 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for job positions..."
                className="w-full pl-12 pr-4 py-4 rounded-full shadow-lg border-0 focus:ring-2 focus:ring-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-lg" />
              </div>
              <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-600 hover:text-primary-700">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f9fafb">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Vacancies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Job Openings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our current job opportunities and find your perfect role at Wolkite University.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-2xl mx-auto rounded-lg">
              <p>{error}</p>
            </div>
          ) : vacancies.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                <FaBriefcase className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Open Positions</h3>
                <p className="text-gray-600 mb-4">There are currently no job openings available.</p>
                <p className="text-gray-600">Please check back later for new opportunities.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="bg-primary-600 p-5 text-white">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{vacancy.position}</h3>
                      <span className="bg-white text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                        {vacancy.quantity} Positions
                      </span>
                    </div>
                    <p className="text-sm flex items-center mt-2 text-primary-100">
                      <FaBuilding className="mr-2" />
                      {vacancy.department?.dep_name || "University Department"}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 space-y-3">
                      <div className="flex items-center text-gray-700">
                        <FaMoneyBillWave className="mr-2 text-primary-600" />
                        <span>Salary: ${vacancy.salary?.toLocaleString() || "Competitive"}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaGraduationCap className="mr-2 text-primary-600" />
                        <span>{vacancy.eduLevel || "Degree Required"}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-primary-600" />
                        <span>Deadline: {new Date(vacancy.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {vacancy.createdAt
                          ? `Posted: ${new Date(vacancy.createdAt).toLocaleDateString()}`
                          : "Recently Posted"}
                      </span>
                      <Link
                        to={`/apply/${vacancy._id}`}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm"
                      >
                        Apply Now <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/vacancies"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
            >
              View All Positions <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our HRMS Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive Human Resource Management System streamlines all HR processes for Wolkite University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-primary-600 text-3xl mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Employee Management</h3>
              <p className="text-gray-600">
                Efficiently manage employee information, onboarding, and documentation in one centralized system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-primary-600 text-3xl mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
                <FaBuilding />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Department Organization</h3>
              <p className="text-gray-600">
                Organize and manage departments, roles, and reporting structures with ease.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-primary-600 text-3xl mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
                <FaCalendarAlt />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Leave Management</h3>
              <p className="text-gray-600">
                Streamline leave requests, approvals, and tracking for all types of employee time off.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-primary-600 text-3xl mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor and evaluate employee performance with customizable metrics and feedback tools.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-primary-600 text-3xl mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
                <FaBriefcase />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Recruitment</h3>
              <p className="text-gray-600">
                Manage job postings, applications, and the entire hiring process from start to finish.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-primary-600 text-3xl mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payroll Management</h3>
              <p className="text-gray-600">
                Automate salary calculations, deductions, and generate comprehensive payroll reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore current job opportunities at Wolkite University and take the next step in your career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vacancies"
              className="bg-white hover:bg-gray-100 text-primary-600 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              <FaBriefcase className="mr-2" /> Browse Vacancies
            </Link>
            <Link
              to="/register"
              className="bg-transparent hover:bg-primary-800 text-white border-2 border-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" /> Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/wolkite.png" alt="Wolkite University" className="h-10 mr-3" />
                <h3 className="text-xl font-bold">Wolkite University</h3>
              </div>
              <p className="text-gray-400">
                Providing quality education and research to empower the next generation of leaders.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/vacancies" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Employee Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>Wolkite University</p>
                <p>Wolkite, Ethiopia</p>
                <p className="mt-2">Email: info@wolkiteuniversity.edu.et</p>
                <p>Phone: +251 123 456 789</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Wolkite University. All rights reserved.</p>
            <p className="mt-2 text-sm">Human Resource Management System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome
