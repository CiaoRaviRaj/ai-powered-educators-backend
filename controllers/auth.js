import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
} from "../constants/appConstants.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User with this email already exists"));
    }

    const user = await User.create({ name, email, password });
    const token = user.getSignedJwtToken();

    res.status(RESPONSE_STATUS_CODE.CREATED).json({
      status: RESPONSE_STATUS_CODE.CREATED,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      error: "",
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, "Please provide an email and password"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(createError(401, "Invalid credentials"));
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(RESPONSE_STATUS_CODE.OK).json({
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      error: "",
      message: "Logged in successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(RESPONSE_STATUS_CODE.OK).json({
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      error: "",
      message: "User fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.status(RESPONSE_STATUS_CODE.OK).json({
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      error: "",
      message: "Logged out successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(RESPONSE_STATUS_CODE.OK).json({
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      error: "",
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
