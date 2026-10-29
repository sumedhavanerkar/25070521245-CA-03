import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { JWT_SECRET } from '../config/jwt.js';

// Middleware: require valid JWT token (used for protected routes)
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];
    if (!token) return next(new AppError('No token provided', 401));

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('User no longer exists or is deactivated', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware: optional auth — attach user if a valid token is present, skip silently if not
// This allows routes to work without authentication (no login required)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // If no Authorization header — just continue without setting req.user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    } catch {
      // Token invalid — just skip attaching user, continue normally
    }

    next();
  } catch (err) {
    next(err);
  }
};

// Middleware: require admin role
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
