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
} from "react-icons/fa"

const PublicVacancies = () => {
  const [vacancies, setVacancies] = useState([])
  const [filteredVacancies, setFilteredVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState([])
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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/wolkite.png" alt="Wolkite University" className="h-12 mr-3" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wolkite University</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-800 hover:text-teal-600 font-medium">
              Home
            </Link>
            <Link to="/vacancies" className="text-teal-600 font-medium">
              Careers
            </Link>
            <Link to="/register" className="text-gray-800 hover:text-teal-600 font-medium">
              Register
            </Link>
            <Link to="/login" className="text-gray-800 hover:text-teal-600 font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-teal-600 hover:text-teal-700">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Current Job Openings</h1>
          <p className="text-gray-600 mt-2">
            Explore available positions at Wolkite University and find your perfect role
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <FaFilter className="text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold">Filter Vacancies</h2>
            </div>

            <button onClick={clearFilters} className="text-sm text-teal-600 hover:text-teal-700">
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
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vacancies List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaBriefcase className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vacancies Found</h3>
            <p className="text-gray-600 mb-4">There are no job openings matching your search criteria at the moment.</p>
            <button onClick={clearFilters} className="text-teal-600 hover:text-teal-700 font-medium">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{vacancy.position}</h3>
                      <p className="text-teal-600 font-medium mb-4">{vacancy.department?.dep_name} Department</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <FaBriefcase className="mr-2 text-gray-400" />
                          <span>Positions: {vacancy.quantity}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMoneyBillWave className="mr-2 text-gray-400" />
                          <span>Salary: {formatCurrency(vacancy.salary)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaGraduationCap className="mr-2 text-gray-400" />
                          <span>Education: {vacancy.eduLevel}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span>Deadline: {new Date(vacancy.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{vacancy.description}</p>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-2">
                      <Link
                        to={`/apply/${vacancy._id}`}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto text-center"
                      >
                        Apply Now
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
      <footer className="bg-gray-800 text-white py-8 mt-12">
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

