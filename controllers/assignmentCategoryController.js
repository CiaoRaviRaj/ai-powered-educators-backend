import AssignmentCategory from "../models/AssignmentCategory.js";
import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
} from "../constants/appConstants.js";
import { generateAndSendResponse } from "../utils/common.js";
import mongoose from "mongoose";
import AssignmentSubCategory from "../models/AssignmentSubCategory.js";

// @desc    Create Assignment Category
// @route   POST /api/assignment-categories/create
// @access  Public
export const createAssignmentCategory = async (req, res, next) => {
  try {
    const { title, subTitle = "", assignmentSubCategoryIds } = req.body;

    if (!title) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        errorCode: COMMON_ERROR_CODE.VALIDATION_ERROR,
        message: "Title is required",
        data: null,
        error: "Validation Error",
      });
    }

    // Validate assignmentSubCategoryIds array format
    if (assignmentSubCategoryIds && !Array.isArray(assignmentSubCategoryIds)) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        errorCode: COMMON_ERROR_CODE.VALIDATION_ERROR,
        message: "Assignment sub-category IDs must be an array",
        data: null,
        error: "Validation Error",
      });
    }

    const invalidIds = assignmentSubCategoryIds.filter(
      id => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidIds.length > 0) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        errorCode: COMMON_ERROR_CODE.VALIDATION_ERROR,
        message: "Invalid assignment sub-category ID format",
        data: { invalidIds },
        error: "Validation Error",
      });
    }

    // Check if all sub-categories exist
    if (assignmentSubCategoryIds.length > 0) {
      const existingSubCategories = await AssignmentSubCategory.find({
        _id: { $in: assignmentSubCategoryIds },
      });

      if (existingSubCategories.length !== assignmentSubCategoryIds.length) {
        // Find which IDs don't exist
        const existingIds = existingSubCategories.map(cat => cat._id.toString());
        const nonExistentIds = assignmentSubCategoryIds.filter(
          id => !existingIds.includes(id)
        );

        return generateAndSendResponse({
          res,
          status: RESPONSE_STATUS_CODE.BAD_REQUEST,
          errorCode: COMMON_ERROR_CODE.VALIDATION_ERROR,
          message: "Some assignment sub-categories do not exist",
          data: { nonExistentIds },
          error: "Validation Error",
        });
      }
    }

    const category = await AssignmentCategory.create({
      title,
      subTitle,
      assignmentSubCategoryIds,
    });

    // Return success response with populated sub-categories
    const populatedCategory = await AssignmentCategory.findById(category._id)
      .populate('assignmentSubCategoryIds');

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.CREATED,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Assignment category created successfully",
      data: populatedCategory,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Assignment Categories
// @route   GET /api/assignment-categories
// @access  Public
export const getAllAssignmentCategories = async (req, res, next) => {
  try {
    const categories = await AssignmentCategory.find().populate(
      "assignmentSubCategoryIds"
    );

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Fetched all assignment categories",
      data: categories,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Assignment Category by ID
// @route   GET /api/assignment-categories/:id
// @access  Public
export const getAssignmentCategoryById = async (req, res, next) => {
  try {
    const category = await AssignmentCategory.findById(req.params.id).populate(
      "assignmentSubCategoryIds"
    );

    if (!category) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        message: "Assignment category not found",
        data: null,
        error: "Not Found",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Fetched assignment category",
      data: category,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Assignment Category
// @route   POST /api/assignment-categories/update/:id
// @access  Public
export const updateAssignmentCategory = async (req, res, next) => {
  try {
    const { title, subTitle, assignmentSubCategoryIds } = req.body;

    const updatedCategory = await AssignmentCategory.findByIdAndUpdate(
      req.params.id,
      { title, subTitle, assignmentSubCategoryIds },
      { new: true }
    );

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Updated assignment category",
      data: updatedCategory,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Assignment Category
// @route   POST /api/assignment-categories/delete/:id
// @access  Public
export const deleteAssignmentCategory = async (req, res, next) => {
  try {
    await AssignmentCategory.findByIdAndDelete(req.params.id);

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Deleted assignment category",
      data: null,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};
