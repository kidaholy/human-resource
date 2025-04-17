import jwt from "jsonwebtoken"
import User from "../models/User.js"

const verifyUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    console.log("Auth header:", authHeader ? "Present" : "Missing")

    if (!authHeader) {
      console.log("No authorization header found")
      req.user = null
      return next()
    }

    // Check if token exists
    const token = authHeader.split(" ")[1]
    if (!token) {
      console.log("No token found in authorization header")
      req.user = null
      return next()
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_KEY)
      console.log("Token verified successfully:", decoded)

      // Find user by ID
      const user = await User.findById(decoded._id).select("-password")
      if (!user) {
        console.log("User not found with token ID:", decoded._id)
        req.user = null
        return next()
      }

      // Set user in request
      console.log(`User authenticated: ${user._id} (${user.role})`)
      req.user = user
      next()
    } catch (tokenError) {
      console.error("Token verification error:", tokenError.message)
      req.user = null
      next()
    }
  } catch (error) {
    console.error("Authentication middleware error:", error)
    req.user = null
    next()
  }
}
export default verifyUser

