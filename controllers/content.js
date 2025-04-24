import Content from "../models/Content.js"
import Project from "../models/Project.js"
import { createError } from "../utils/error.js"

// @desc    Create new content
// @route   POST /api/content
// @access  Private
export const createContent = async (req, res, next) => {
  try {
    const { title, content, contentType, projectId, prompt, metadata } = req.body

    // Check if project exists and user owns it
    const project = await Project.findById(projectId)
    if (!project) {
      return next(createError(404, "Project not found"))
    }

    if (project.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to add content to this project"))
    }

    // Create content
    const newContent = await Content.create({
      title,
      content,
      contentType,
      project: projectId,
      user: req.user.id,
      prompt,
      metadata: metadata || {},
    })

    // Add content to project
    project.generatedContent.push(newContent._id)
    await project.save()

    res.status(201).json({
      success: true,
      data: newContent,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all contents for a user
// @route   GET /api/content
// @access  Private
export const getContents = async (req, res, next) => {
  try {
    const { projectId } = req.query

    const query = { user: req.user.id }

    if (projectId) {
      query.project = projectId
    }

    const contents = await Content.find(query).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Private
export const getContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)

    if (!content) {
      return next(createError(404, "Content not found"))
    }

    // Check if user owns the content
    if (content.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to access this content"))
    }

    res.status(200).json({
      success: true,
      data: content,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
export const updateContent = async (req, res, next) => {
  try {
    let content = await Content.findById(req.params.id)

    if (!content) {
      return next(createError(404, "Content not found"))
    }

    // Check if user owns the content
    if (content.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to update this content"))
    }

    // Increment version if content is being updated
    if (req.body.content && req.body.content !== content.content) {
      req.body.version = content.version + 1
    }

    content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: content,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
export const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)

    if (!content) {
      return next(createError(404, "Content not found"))
    }

    // Check if user owns the content
    if (content.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to delete this content"))
    }

    // Remove content from project
    await Project.findByIdAndUpdate(content.project, {
      $pull: { generatedContent: content._id },
    })

    await content.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Download content as file
// @route   GET /api/content/:id/download
// @access  Private
export const downloadContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)

    if (!content) {
      return next(createError(404, "Content not found"))
    }

    // Check if user owns the content
    if (content.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to access this content"))
    }

    // Set headers for file download
    res.setHeader("Content-Type", "text/plain")
    res.setHeader("Content-Disposition", `attachment; filename=${content.title.replace(/\s+/g, "_")}.txt`)

    // Send content as file
    res.send(content.content)
  } catch (error) {
    next(error)
  }
}
