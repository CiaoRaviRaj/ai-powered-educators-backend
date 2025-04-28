// controllers/assignmentSubCategoryController.js

import AssignmentSubCategory from "../models/AssignmentSubCategory.js";
import { generateAndSendResponse } from "../utils/common.js";
import { RESPONSE_STATUS_CODE, COMMON_ERROR_CODE } from "../constants/appConstants.js";

// @desc    Create assignment sub-category
// @route   POST /api/assignment-sub-category/create
// @access  Public 
export const createSubCategory = async (req, res, next) => {
  try {
    const { title, systemPrompt } = req.body;

    if (!title) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.BAD_REQUEST,
        message: "Title is required!",
        error: "",
        errorCode: COMMON_ERROR_CODE.VALIDATION_ERROR,
        data: "",
      });
    }

    const createSubCategoryObject = {
      title,
      systemPrompt,
    }

    if (!createSubCategoryObject.systemPrompt) {
      createSubCategoryObject.systemPrompt = await aiModelRunn
    }

    const subCategory = await AssignmentSubCategory.create(createSubCategoryObject);

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.CREATED,
      message: "Sub-category created successfully",
      error: "",
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assignment sub-categories
// @route   GET /api/assignment-sub-category
// @access  Public
export const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await AssignmentSubCategory.find()

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      message: "Sub-categories fetched successfully",
      error: "",
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      data: subCategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sub-category by ID
// @route   GET /api/assignment-sub-category/:id
// @access  Public
export const getSubCategoryById = async (req, res, next) => {
  try {
    const subCategory = await AssignmentSubCategory.findById(
      req.params.id
    )

    if (!subCategory) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Sub-category not found",
        error: "",
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      message: "Sub-category fetched successfully",
      error: "",
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sub-category
// @route   POST /api/assignment-sub-category/update/:id
// @access  Protected
export const updateSubCategory = async (req, res, next) => {
  try {
    const updated = await AssignmentSubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Sub-category not found",
        error: "",
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      message: "Sub-category updated successfully",
      error: "",
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sub-category
// @route   POST /api/assignment-sub-category/delete/:id
// @access  Protected
export const deleteSubCategory = async (req, res, next) => {
  try {
    const deleted = await AssignmentSubCategory.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Sub-category not found",
        error: "",
        errorCode: COMMON_ERROR_CODE.NOT_FOUND,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.OK,
      message: "Sub-category deleted successfully",
      error: "",
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};
