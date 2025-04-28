import Grade from "../models/Grade.js";
import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
  RESPONSE_STATUS_CODE_MESSAGE,
} from "../constants/appConstants.js";
import { generateAndSendResponse } from "../utils/common.js";

// @desc    Create Grade
// @route   POST /api/grades/create
// @access  Public
export const createGrade = async (req, res, next) => {
  try {
    const { title, systemPrompt } = req.body;
    if (!title) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        errorCode: COMMON_ERROR_CODE.ATC001,
        message: "",
        data: "",
        error: RESPONSE_STATUS_CODE_MESSAGE.BAD_REQUEST,
      });
    }
    const grade = await Grade.create({ title, systemPrompt });

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.CREATED,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Grade created successfully",
      data: grade,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Grades
// @route   GET /api/grades
// @access  Public
export const getGrades = async (req, res, next) => {
  try {
    const grades = await Grade.find();

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.OK,
      message: "Grades retrieved successfully",
      data: grades,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Grade
// @route   GET /api/grades/:id
// @access  Public
export const getGradeById = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Grade not found",
        error: "No grade with this ID",
        errorCode: COMMON_ERROR_CODE.ACG404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Grade retrieved successfully",
      data: grade,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Grade
// @route   POST /api/grades/update/:id
// @access  Public
export const updateGrade = async (req, res, next) => {
  try {
    const { title, systemPrompt } = req.body;
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { title, systemPrompt },
      { new: true, runValidators: true }
    );

    if (!grade) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Grade not found",
        error: "No grade with this ID",
        errorCode: COMMON_ERROR_CODE.ACG404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Grade updated successfully",
      data: grade,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Grade
// @route   POST /api/grades/delete/:id
// @access  Public
export const deleteGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);

    if (!grade) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Grade not found",
        error: "No grade with this ID",
        errorCode: COMMON_ERROR_CODE.ACG404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Grade deleted successfully",
      data: "",
      error: "",
    });
  } catch (error) {
    next(error);
  }
};
