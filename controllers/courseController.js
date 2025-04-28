import Course from "../models/Course.js";
import {
  COMMON_ERROR_CODE,
  RESPONSE_STATUS_CODE,
} from "../constants/appConstants.js";
import { generateAndSendResponse } from "../utils/common.js";

// @desc    Create Course
// @route   POST /api/courses/create
// @access  Pri
export const createCourse = async (req, res, next) => {
  try {
    const {
      courseTitle,
      subjectId,
      gradeId,
      courseDescription,
      generationPrompt,
      additionalInformation,
      systemPrompt,
    } = req.body;

    const createObject = {
      courseTitle,
      subjectId,
      gradeId,
      courseDescription,
      generationPrompt,
      additionalInformation,
      userId: req.me._id,
    }
    if (!systemPrompt) {
      createObject.systemPrompt = ModuleWiseSystemPrompt["COURSE"]
    }

    const course = await Course.create(createObject);

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.CREATED,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Course created successfully",
      data: course,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { courseTitle: { $regex: search, $options: 'i' } },
        { courseDescription: { $regex: search, $options: 'i' } },
        { additionalInformation: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate("subjectId")
      .populate("gradeId");

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Courses retrieved successfully",
      data: courses,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Course
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("subjectId")
      .populate("gradeId");

    if (!course) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Course not found",
        error: "No course with this ID",
        errorCode: COMMON_ERROR_CODE.ACC404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Course retrieved successfully",
      data: course,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Course
// @route   POST /api/courses/update/:id
// @access  Private
export const updateCourse = async (req, res, next) => {
  try {
    const {
      courseTitle,
      subjectId,
      gradeId,
      courseDescription,
      generationPrompt,
      additionalInformation,
      systemPrompt,
    } = req.body;

    const updateObject = {
      courseTitle,
      subjectId,
      gradeId,
      courseDescription,
      generationPrompt,
    }

    if (!systemPrompt) {
      createObject.systemPrompt = ModuleWiseSystemPrompt["COURSE"]
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateObject,
      { new: true, runValidators: true }
    );

    if (!course) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Course not found",
        error: "No course with this ID",
        errorCode: COMMON_ERROR_CODE.ACC404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Course updated successfully",
      data: course,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Course
// @route   POST /api/courses/delete/:id
// @access  Private
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return generateAndSendResponse({
        res,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        message: "Course not found",
        error: "No course with this ID",
        errorCode: COMMON_ERROR_CODE.ACC404,
        data: "",
      });
    }

    generateAndSendResponse({
      res,
      status: RESPONSE_STATUS_CODE.SUCCESS,
      errorCode: COMMON_ERROR_CODE.SUCCESS,
      message: "Course deleted successfully",
      data: "",
      error: "",
    });
  } catch (error) {
    next(error);
  }
};
