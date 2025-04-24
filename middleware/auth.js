import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { createError } from "../utils/error.js"

export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Not authorized to access this route"))
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return next(createError(401, "User no longer exists"))
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    return next(createError(401, "Not authorized to access this route"))
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, `Role ${req.user.role} is not authorized to access this route`))
    }
    next()
  }
}
