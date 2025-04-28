import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "../utils/error.js";
import { generateAndSendResponse } from "../utils/common.js";
import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
  RESPONSE_STATUS_CODE_MESSAGE,
} from "../constants/appConstants.js";

export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.UNAUTHORIZED,
        error: RESPONSE_STATUS_CODE_MESSAGE.UNAUTHORIZED,
        message: RESPONSE_STATUS_CODE_MESSAGE.UNAUTHORIZED,
        data: {},
        errorCode: COMMON_ERROR_CODE.AUTH401,
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        error: RESPONSE_STATUS_CODE_MESSAGE.NOT_FOUND,
        message: RESPONSE_STATUS_CODE_MESSAGE.NOT_FOUND,
        data: {},
        errorCode: COMMON_ERROR_CODE.AUTH404,
      });
    }

    // Add user to request
    req.me = user;
    next();
  } catch (error) {
    console.log("error:adsdasd ", error);
    return next(createError(401, "Not authorized to access this route"));
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          403,
          `Role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
