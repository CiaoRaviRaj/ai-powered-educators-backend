import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
} from "../constants/appConstants.js";
import User from "../models/User.js";
import { generateAndSendResponse } from "../utils/common.js";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        message: "User with this email already exists",
        error: "",
        errorCode: COMMON_ERROR_CODE.ACU400,
        data: "",
      });
    }

    const user = await User.create({ name, email, password });
    const token = user.getSignedJwtToken();

    generateAndSendResponse({
      res,
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
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        message: "Please provide a valide email and password!",
        error: "",
        errorCode: COMMON_ERROR_CODE.ATC001,
        data: "",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "User not found",
        error: "",
        errorCode: COMMON_ERROR_CODE.AUTH404,
        data: "",
      });
    }
    console.log("user", user);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        message: "Please provide a valide email and password!",
        error: "",
        errorCode: COMMON_ERROR_CODE.ATC001,
        data: "",
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = user.getSignedJwtToken();

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      message: "Logged in successfully",
      error: "",
      errorCode: COMMON_ERROR_CODE.SUCCESS,
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
