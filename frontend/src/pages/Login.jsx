"use client"

import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import { FaEnvelope, FaLock, FaSignInAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      if (response.data.success) {
        login(response.data.user)
        localStorage.setItem("token", response.data.token)

        // Redirect based on user role
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard")
        } else if (response.data.user.role === "department_head") {
          navigate("/department-head-dashboard")
        } else {
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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/wolkite-uni.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center rounded-xl overflow-hidden shadow-2xl">
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
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center mr-4">
                <FaUsers className="text-white" />
              </div>
              <p>Employee Management</p>
            </div>

            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center mr-4">
                <FaCalendarAlt className="text-white" />
              </div>
              <p>Leave Management</p>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center mr-4">
                <FaMoneyBillWave className="text-white" />
              </div>
              <p>Payroll Management</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login to your account</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="input-field pl-10"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label className="inline-flex items-center" htmlFor="remember">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  id="remember"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
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
            © 2023 Wolkite University Human Resource Management System
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

