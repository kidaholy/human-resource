"use client"

import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

const userContext = createContext()

// Rename the component to AuthProvider to match the import in App.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token")
        console.log("Verifying user with token:", token ? "Token exists" : "No token")

        if (token) {
          const response = await axios.get("http://localhost:5000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          console.log("Verify response:", response.data)

          if (response.data.success) {
            console.log("User verified:", response.data.user)
            setUser(response.data.user)
          } else {
            console.log("Verification failed, clearing user")
            setUser(null)
            localStorage.removeItem("token")
          }
        } else {
          console.log("No token found, user is not logged in")
          setUser(null)
        }
      } catch (error) {
        console.error("Error verifying user:", error)
        setUser(null)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    verifyUser()
  }, [])

  const login = (userData, token) => {
    console.log("Logging in user:", userData)
    if (token) {
      localStorage.setItem("token", token)
    }
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }
  return <userContext.Provider value={{ user, login, logout, loading }}>{children}</userContext.Provider>
}

export const useAuth = () => useContext(userContext)
// Remove the default export since we're using named exports
