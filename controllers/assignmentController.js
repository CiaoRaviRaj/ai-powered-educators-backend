import Assignment from "../models/Assignment.js";
import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
} from "../constants/appConstants.js";
import { generateAndSendResponse } from "../utils/common.js";
import { generateAssignmentSystemPrompt } from "../helpers/assignment/index.js";

// @desc    Create Assignment
// @route   POST /api/assignments/create
// @access  Private
export const createAssignment = async (req, res, next) => {
  try {
    const {
      title,
      courseId,
      assignmentCategoryId,
      dueDate,
      description,
      learningObjectivesDescription,
      canvas = false,
      google = false,
      googleMeet = false,
    } = req.body;


    if (!title || !assignmentCategoryId || !dueDate) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        errorCode: COMMON_ERROR_CODE.VALIDATION_ERROR,
        message: "Required fields: title, assignmentCategoryId, dueDate",
        data: null,
        error: "Validation Error",
      });
    }

    // Generate system prompt
    const systemPrompt = await generateAssignmentSystemPrompt({
      title,
      description,
      learningObjectivesDescription,
      courseId,
      assignmentCategoryId,
    });

    const createObject = {
      title,
      assignmentCategoryId,
      dueDate,
      userId: req.me._id,
      canvas,
      google,
      googleMeet,
      systemPrompt: JSON.stringify(systemPrompt), // Store the generated system prompt
    };

    if (courseId) {
      createObject.courseId = courseId;
    }

    if (description) {
      createObject.description = description;
    }

    if (learningObjectivesDescription) {
      createObject.learningObjectivesDescription = learningObjectivesDescription;
    }

    const assignment = await Assignment.create(createObject);

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.CREATED,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Assignment created successfully",
      data: assignment,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Assignments
// @route   GET /api/assignments
// @access  Private
export const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ userId: req.me._id })
      .populate("courseId")
      .populate("assignmentCategoryId");

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Fetched all assignments",
      data: assignments,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      userId: req.me._id,
    })
      .populate("courseId")
      .populate("assignmentCategoryId");

    if (!assignment) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        message: "Assignment not found",
        data: null,
        error: "Not Found",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Fetched assignment",
      data: assignment,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Assignment
// @route   POST /api/assignments/update/:id
// @access  Private 
export const updateAssignment = async (req, res, next) => {
  try {
    // Validate systemPrompt if present
    if (req.body.systemPrompt !== undefined) {
      try {
        JSON.parse(req.body.systemPrompt);
      } catch (err) {
        return generateAndSendResponse({
          res,
          status: RESPONSE_STATUS_CODE.BAD_REQUEST,
          errorCode: COMMON_ERROR_CODE.INVALID_INPUT,
          message: "systemPrompt must be a valid JSON string.",
          data: null,
          error: "Invalid systemPrompt format",
        });
      }
    }
    // Build the update object dynamically
    const updateFields = {};
    const allowedFields = [
      "title",
      "courseId",
      "assignmentCategoryId",
      "dueDate",
      "description",
      "learningObjectivesDescription",
      "canvas",
      "google",
      "googleMeet",
      "systemPrompt",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updated = await Assignment.findOneAndUpdate(
      { _id: req.params.id, userId: req.me._id },
      updateFields,
      { new: true }
    );

    if (!updated) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        message: "Assignment not found",
        data: null,
        error: "Not Found",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Updated assignment",
      data: updated,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Assignment
// @route   POST /api/assignments/delete/:id
// @access  Private
export const deleteAssignment = async (req, res, next) => {
  try {
    const deleted = await Assignment.findOneAndDelete({
      _id: req.params.id,
      userId: req.me._id,
    });

    if (!deleted) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        message: "Assignment not found",
        data: null,
        error: "Not Found",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Deleted assignment",
      data: null,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};
