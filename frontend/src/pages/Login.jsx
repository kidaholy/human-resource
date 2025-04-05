"use client"

import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      if (response.data.success) {
        // alert("Successfully logged in")
        login(response.data.user)
        localStorage.setItem("token", response.data.token)
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard")
        } else {
          navigate("/employee-dashboard")
        }
      }
      console.log(response)
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error)
      } else {
        setError("Server Error")
      }
    }
  }

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/wolkite-uni.png')" }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 px-4 md:px-0">
        <img className="w-28 md:w-36 object-fit animate-pulse" src="/wolkite.png" alt="logo" />
        <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-10">
          <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
            <p className="text-white text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Wolkite University
              <br />
              Human Resource Management System
            </p>
            <div className="h-1 w-24 bg-teal-600 rounded-full"></div>
          </div>
          <div className="border shadow-lg p-8 w-full md:w-96 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg animate-slide-in">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                  autoComplete="email-required"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  required
                  autoComplete="password-required"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-6 flex items-center justify-between">
                <label className="inline-flex items-center" htmlFor="remember">
                  <input type="checkbox" className="form-checkbox text-teal-600" id="remember" />
                  <span className="ml-2 text-white">Remember me</span>
                </label>
                <a href="#" className="text-white hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <footer className="text-white mt-6">
          <p>&copy; 2023 Wolkite Human Resource Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
export default Login

