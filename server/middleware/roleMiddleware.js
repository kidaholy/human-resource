const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" })
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: "You don't have permission to access this resource",
        })
      }
  
      next()
    }
  }
  
  export default roleMiddleware
  
  