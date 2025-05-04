const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized - No user found" })
    }

    if (allowedRoles.includes(req.user.role)) {
      next()
    } else {
      return res.status(403).json({
        success: false,
        error: "Forbidden - You do not have permission to access this resource",
      })
    }
  }
}

export default roleMiddleware
