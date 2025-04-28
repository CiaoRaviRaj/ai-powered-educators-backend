import Subject from "../models/Subject.js";
import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
} from "../constants/appConstants.js";
import { generateAndSendResponse } from "../utils/common.js";
import { createError } from "../utils/error.js";

// @desc    Create Subject
// @route   POST /api/subjects/create
// @access  Public
export const createSubject = async (req, res, next) => {
  try {
    const { title, systemPrompt } = req.body;
    const subject = await Subject.create({ title, systemPrompt });

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.CREATED,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Subject created successfully",
      data: subject,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Subjects
// @route   GET /api/subjects
// @access  Public
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Subjects retrieved successfully",
      data: subjects,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Subject
// @route   GET /api/subjects/:id
// @access  Public
export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Subject not found",
        error: "No subject with this ID",
        errorCode: COMMON_ERROR_CODE.ACS404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Subject retrieved successfully",
      data: subject,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Subject
// @route   POST /api/subjects/update/:id
// @access  Public
export const updateSubject = async (req, res, next) => {
  try {
    const { title, systemPrompt } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { title, systemPrompt },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Subject not found",
        error: "No subject with this ID",
        errorCode: COMMON_ERROR_CODE.ACS404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Subject updated successfully",
      data: subject,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Subject
// @route   POST /api/subjects/delete/:id
// @access  Public
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Subject not found",
        error: "No subject with this ID",
        errorCode: COMMON_ERROR_CODE.ACS404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Subject deleted successfully",
      data: "",
      error: "",
    });
  } catch (error) {
    next(error);
  }
};
