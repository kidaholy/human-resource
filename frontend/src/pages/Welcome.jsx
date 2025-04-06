"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaBuilding, FaUsers, FaCalendarAlt, FaChartLine, FaBriefcase, FaArrowRight } from "react-icons/fa"
import axios from "axios"

const Welcome = () => {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vacancies/featured")
        if (response.data.success) {
          setVacancies(response.data.vacancies)
        } else {
          // If API doesn't have featured endpoint, use mock data
          setVacancies([
            {
              _id: "vac1",
              position: "Senior Lecturer",
              department: { dep_name: "Computer Science" },
              endDate: "2023-12-31",
            },
            {
              _id: "vac2",
              position: "Assistant Professor",
              department: { dep_name: "Electrical Engineering" },
              endDate: "2023-11-30",
            },
            {
              _id: "vac3",
              position: "Lab Assistant",
              department: { dep_name: "Computer Science" },
              endDate: "2023-10-15",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error)
        // Use mock data if API fails
        setVacancies([
          {
            _id: "vac1",
            position: "Senior Lecturer",
            department: { dep_name: "Computer Science" },
            endDate: "2023-12-31",
          },
          {
            _id: "vac2",
            position: "Assistant Professor",
            department: { dep_name: "Electrical Engineering" },
            endDate: "2023-11-30",
          },
          {
            _id: "vac3",
            position: "Lab Assistant",
            department: { dep_name: "Computer Science" },
            endDate: "2023-10-15",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
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
            <Link to="/vacancies" className="text-gray-800 hover:text-teal-600 font-medium">
              Careers
            </Link>
            <Link to="/register" className="text-gray-800 hover:text-teal-600 font-medium">
              Register
            </Link>
            <Link to="/login" className="text-gray-800 hover:text-teal-600 font-medium">
              Login
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-800 hover:text-teal-600">
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
      </header>

      {/* Hero Section */}
      <section
        className="bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/wolkite-uni.png')",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Human Resource Management System</h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Join our team at Wolkite University and be part of our mission to provide quality education and research.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vacancies"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              View Open Positions
            </Link>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-teal-600 font-bold py-3 px-6 rounded-md transition-colors"
            >
              Employee Login
            </Link>
          </div>
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-teal-600 text-white p-4">
                    <h3 className="text-xl font-bold">{vacancy.position}</h3>
                    <p className="text-sm">{vacancy.department.dep_name} Department</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      Application Deadline: {new Date(vacancy.endDate).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/apply/${vacancy._id}`}
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Apply Now <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/vacancies"
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
              View All Positions <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our HRMS Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive Human Resource Management System streamlines all HR processes for Wolkite University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-teal-600 text-3xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Employee Management</h3>
              <p className="text-gray-600">
                Efficiently manage employee information, onboarding, and documentation in one centralized system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-teal-600 text-3xl mb-4">
                <FaBuilding />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Department Organization</h3>
              <p className="text-gray-600">
                Organize and manage departments, roles, and reporting structures with ease.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-teal-600 text-3xl mb-4">
                <FaCalendarAlt />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Leave Management</h3>
              <p className="text-gray-600">
                Streamline leave requests, approvals, and tracking for all types of employee time off.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-teal-600 text-3xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor and evaluate employee performance with customizable metrics and feedback tools.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-teal-600 text-3xl mb-4">
                <FaBriefcase />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Recruitment</h3>
              <p className="text-gray-600">
                Manage job postings, applications, and the entire hiring process from start to finish.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-teal-600 text-3xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
      <section className="py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore current job opportunities at Wolkite University and take the next step in your career.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vacancies"
              className="bg-white hover:bg-gray-100 text-teal-600 font-bold py-3 px-6 rounded-md transition-colors"
            >
              Browse Vacancies
            </Link>
            <Link
              to="/register"
              className="bg-transparent hover:bg-teal-700 text-white border border-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
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

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Wolkite University. All rights reserved.</p>
            <p className="mt-2 text-sm">Human Resource Management System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome

