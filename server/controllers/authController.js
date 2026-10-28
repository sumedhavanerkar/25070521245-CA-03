import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

// Generate JWT token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return next(new AppError('An account with this email already exists', 409));
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook will hash it
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Select passwordHash explicitly (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found', 404));

    res.json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout  (client just drops the token; this is a placeholder)
export const logout = (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
