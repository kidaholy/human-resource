"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaBriefcase,
  FaCalendarAlt,
  FaGraduationCap,
  FaMoneyBillWave,
  FaBuilding,
  FaMapMarkerAlt,
  FaChevronDown,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa"

const PublicVacancies = () => {
  const [vacancies, setVacancies] = useState([])
  const [filteredVacancies, setFilteredVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    department: "",
    search: "",
  })

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vacancies/public")
        if (response.data.success) {
          setVacancies(response.data.vacancies)
          setFilteredVacancies(response.data.vacancies)

          // Extract unique departments
          const depts = [...new Set(response.data.vacancies.map((v) => v.department?.dep_name))]
            .filter(Boolean)
            .map((name) => ({ name }))
          setDepartments(depts)
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error)
        setVacancies([])
        setFilteredVacancies([])
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  useEffect(() => {
    // Apply filters whenever filters state changes
    let results = vacancies

    // Filter by department
    if (filters.department) {
      results = results.filter((vacancy) => vacancy.department?.dep_name === filters.department)
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      results = results.filter(
        (vacancy) =>
          vacancy.position.toLowerCase().includes(searchTerm) ||
          vacancy.department?.dep_name.toLowerCase().includes(searchTerm) ||
          vacancy.description.toLowerCase().includes(searchTerm),
      )
    }

    setFilteredVacancies(results)
  }, [filters, vacancies])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      department: "",
      search: "",
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link to="/vacancies" className="text-primary-600 font-medium transition-colors">
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
                <Link to="/vacancies" className="text-primary-600 font-medium">
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Current Job Openings</h1>
          <p className="text-gray-600 mt-2">
            Explore available positions at Wolkite University and find your perfect role
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FaFilter className="text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Filter Vacancies</h2>
            </div>

            <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by position or keywords"
                className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-400" />
              </div>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all appearance-none bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaChevronDown className="text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Vacancies List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FaBriefcase className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vacancies Found</h3>
            <p className="text-gray-600 mb-4">There are no job openings matching your search criteria at the moment.</p>
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <div className="flex items-start gap-2">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{vacancy.position}</h3>
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                          {vacancy.quantity} Positions
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        <FaBuilding className="text-primary-600 mr-1" />
                        <p className="text-primary-600 font-medium">{vacancy.department?.dep_name} Department</p>
                        <span className="mx-2 text-gray-300">•</span>
                        <FaMapMarkerAlt className="text-gray-500 mr-1" />
                        <p className="text-gray-500">Wolkite, Ethiopia</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                        <div className="flex items-center text-gray-700">
                          <FaBriefcase className="mr-2 text-primary-600" />
                          <span>Type: Full-time</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaMoneyBillWave className="mr-2 text-primary-600" />
                          <span>Salary: {formatCurrency(vacancy.salary)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaGraduationCap className="mr-2 text-primary-600" />
                          <span>Education: {vacancy.eduLevel}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaCalendarAlt className="mr-2 text-primary-600" />
                          <span>Deadline: {new Date(vacancy.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                        <p className="text-gray-700">{vacancy.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-3 md:min-w-[200px]">
                      <Link
                        to={`/register?vacancy=${vacancy._id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors w-full md:w-auto text-center flex items-center justify-center"
                      >
                        <FaUserPlus className="mr-2" /> Apply Now
                      </Link>
                      <Link
                        to={`/login?vacancy=${vacancy._id}`}
                        className="bg-white hover:bg-gray-50 text-primary-600 border border-primary-600 font-bold py-2.5 px-6 rounded-lg transition-colors w-full md:w-auto text-center flex items-center justify-center"
                      >
                        <FaSignInAlt className="mr-2" /> Login to Apply
                      </Link>
                      <span className="text-sm text-gray-500">
                        Posted: {new Date(vacancy.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/wolkite.png" alt="Wolkite University" className="h-10 mr-3" />
              <h3 className="text-xl font-bold">Wolkite University</h3>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">© {new Date().getFullYear()} Wolkite University. All rights reserved.</p>
              <p className="text-sm text-gray-500 mt-1">Human Resource Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicVacancies
