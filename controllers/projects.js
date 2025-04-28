import Project from "../models/Project.js"
import { createError } from "../utils/error.js"

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { title, description, subject, gradeLevel, contentType } = req.body

    const project = await Project.create({
      title,
      description,
      subject,
      gradeLevel,
      contentType,
      user: req.me._id,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for educators, helping to generate educational content.",
        },
      ],
    })

    res.status(201).json({
      success: true,
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.me._id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("files").populate("generatedContent")

    if (!project) {
      return next(createError(404, "Project not found"))
    }

    // Check if user owns the project
    if (project.user.toString() !== req.me._id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to access this project"))
    }

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id)

    if (!project) {
      return next(createError(404, "Project not found"))
    }

    // Check if user owns the project
    if (project.user.toString() !== req.me._id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to update this project"))
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return next(createError(404, "Project not found"))
    }

    // Check if user owns the project
    if (project.user.toString() !== req.me._id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to delete this project"))
    }

    await project.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add message to project
// @route   POST /api/projects/:id/messages
// @access  Private
export const addMessageToProject = async (req, res, next) => {
  try {
    const { role, content } = req.body

    if (!role || !content) {
      return next(createError(400, "Please provide role and content"))
    }

    const project = await Project.findById(req.params.id)

    if (!project) {
      return next(createError(404, "Project not found"))
    }

    // Check if user owns the project
    if (project.user.toString() !== req.me._id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to update this project"))
    }

    // Add message to project
    project.messages.push({
      role,
      content,
      timestamp: Date.now(),
    })

    await project.save()

    res.status(200).json({
      success: true,
      data: project,
    })
  } catch (error) {
    next(error)
  }
}
