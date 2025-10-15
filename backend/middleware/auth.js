import jwt from "jsonwebtoken";
import User from "../model/user.js";

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check for token in cookies (if using cookies)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route"
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "No user found with this token"
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: "User account is deactivated"
        });
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route"
      });
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Silently fail for optional auth
        console.log("Optional auth failed:", error.message);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Check if user owns the resource or is admin
export const ownerOrAdmin = (resourceField = "user") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceId = req.params.id || req.body[resourceField];
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        error: "Resource ID not found"
      });
    }

    // For now, we'll assume the resource has a user field
    // This will be customized per route
    if (req.resource && req.resource[resourceField]?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to access this resource"
      });
    }

    next();
  };
};

// Rate limiting for auth endpoints
export const authRateLimit = (req, res, next) => {
  // Simple in-memory rate limiting (in production, use Redis or similar)
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 attempts per 15 minutes

  if (!global.authRateLimit) {
    global.authRateLimit = new Map();
  }

  const userAttempts = global.authRateLimit.get(clientIP) || [];

  // Remove old attempts outside the window
  const validAttempts = userAttempts.filter(attempt => now - attempt < windowMs);

  if (validAttempts.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: "Too many authentication attempts. Please try again later."
    });
  }

  // Add current attempt
  validAttempts.push(now);
  global.authRateLimit.set(clientIP, validAttempts);

  next();
};