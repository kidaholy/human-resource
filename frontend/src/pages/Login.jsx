"use client"

import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/authContext"
import { useNavigate, Link, useLocation } from "react-router-dom"
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const vacancyId = searchParams.get("vacancy")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      if (response.data.success) {
        login(response.data.user)
        localStorage.setItem("token", response.data.token)

        // Redirect based on role and context
        if (response.data.user.role === "applicant") {
          // If coming from a vacancy listing, redirect to the application page
          if (vacancyId) {
            navigate(`/apply/${vacancyId}`)
          } else {
            navigate("/applicant-dashboard")
          }
        } else if (response.data.user.role === "admin") {
          navigate("/admin-dashboard")
        } else if (response.data.user.role === "department_head") {
          navigate("/department-head-dashboard")
        } else if (response.data.user.role === "employee") {
          navigate("/employee-dashboard")
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error)
      } else {
        setError("Server Error")
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/wolkite-uni.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-stretch rounded-2xl overflow-hidden shadow-2xl">
        {/* Left side - Info */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-8 lg:p-12 text-white">
          <div className="flex items-center mb-8">
            <img className="w-12 h-12 mr-4" src="/wolkite.png" alt="logo" />
            <h1 className="text-2xl font-bold">Wolkite University</h1>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Human Resource Management System</h2>

          <p className="text-primary-100 mb-8">
            Manage your organization's human resources efficiently with our comprehensive HRMS solution.
          </p>

          <div className="hidden lg:block">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center mr-4 shadow-lg">
                <FaUsers className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Employee Management</h3>
                <p className="text-sm text-primary-100">Centralized employee data and profiles</p>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center mr-4 shadow-lg">
                <FaCalendarAlt className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Leave Management</h3>
                <p className="text-sm text-primary-100">Streamlined leave request and approval</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center mr-4 shadow-lg">
                <FaMoneyBillWave className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Payroll Management</h3>
                <p className="text-sm text-primary-100">Automated salary processing and history</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Please sign in to your account</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-medium">Login Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input-field pl-10"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center" htmlFor="remember">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  id="remember"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center">
                  <FaSignInAlt className="mr-2" />
                  Login
                </span>
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={vacancyId ? `/register?vacancy=${vacancyId}` : "/register"}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Register now
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Wolkite University Human Resource Management System
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
