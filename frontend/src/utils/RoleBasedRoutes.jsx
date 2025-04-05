"use client"
import { useAuth } from "../context/authContext.jsx"
import { Navigate } from "react-router-dom"

const RoleBasedRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!requiredRole.includes(user.role)) {
    ;<Navigate to="/unauthorized" />
  }

  return user ? children : <Navigate to="/login" />
}

export default RoleBasedRoutes

