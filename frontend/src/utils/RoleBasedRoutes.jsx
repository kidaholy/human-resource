"use client"
import { useAuth } from "../context/authContext.jsx"
import { Navigate } from "react-router-dom"

const RoleBasedRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!requiredRole.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" />
    } else if (user.role === "department_head") {
      return <Navigate to="/department-head-dashboard" />
    } else if (user.role === "employee") {
      return <Navigate to="/employee-dashboard" />
    } else {
      return <Navigate to="/unauthorized" />
    }
  }

  return user ? children : <Navigate to="/login" />
}

export default RoleBasedRoutes

