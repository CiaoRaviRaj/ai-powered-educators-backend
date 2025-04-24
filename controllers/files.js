import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { v4 as uuidv4 } from "uuid"
import File from "../models/File.js"
import Project from "../models/Project.js"
import { createError } from "../utils/error.js"
import { processFileContent } from "../services/fileProcessor.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, "..", "uploads")

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(createError(400, "No files were uploaded"))
    }

    const { projectId } = req.body

    // Check if project exists and user owns it
    if (projectId) {
      const project = await Project.findById(projectId)
      if (!project) {
        return next(createError(404, "Project not found"))
      }

      if (project.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(createError(403, "Not authorized to add files to this project"))
      }
    }

    const uploadedFile = req.files.file
    const fileExtension = path.extname(uploadedFile.name)
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join("uploads", fileName)
    const fullPath = path.join(__dirname, "..", filePath)

    // Move file to upload directory
    await uploadedFile.mv(fullPath)

    // Create file record in database
    const file = await File.create({
      filename: fileName,
      originalName: uploadedFile.name,
      path: filePath,
      mimetype: uploadedFile.mimetype,
      size: uploadedFile.size,
      user: req.user.id,
      project: projectId || null,
    })

    // Add file to project if projectId is provided
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, {
        $push: { files: file._id },
      })
    }

    res.status(201).json({
      success: true,
      data: file,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all files for a user
// @route   GET /api/files
// @access  Private
export const getFiles = async (req, res, next) => {
  try {
    const { projectId } = req.query

    const query = { user: req.user.id }

    if (projectId) {
      query.project = projectId
    }

    const files = await File.find(query).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
export const getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return next(createError(404, "File not found"))
    }

    // Check if user owns the file
    if (file.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to access this file"))
    }

    res.status(200).json({
      success: true,
      data: file,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return next(createError(404, "File not found"))
    }

    // Check if user owns the file
    if (file.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to delete this file"))
    }

    // Remove file from project if it belongs to one
    if (file.project) {
      await Project.findByIdAndUpdate(file.project, {
        $pull: { files: file._id },
      })
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "..", file.path)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await file.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
export const downloadFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return next(createError(404, "File not found"))
    }

    // Check if user owns the file
    if (file.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to access this file"))
    }

    const filePath = path.join(__dirname, "..", file.path)

    if (!fs.existsSync(filePath)) {
      return next(createError(404, "File not found on server"))
    }

    res.download(filePath, file.originalName)
  } catch (error) {
    next(error)
  }
}

// @desc    Process file content (extract text, analyze, etc.)
// @route   POST /api/files/:id/process
// @access  Private
export const processFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return next(createError(404, "File not found"))
    }

    // Check if user owns the file
    if (file.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to process this file"))
    }

    const filePath = path.join(__dirname, "..", file.path)

    if (!fs.existsSync(filePath)) {
      return next(createError(404, "File not found on server"))
    }

    // Process file content
    const textContent = await processFileContent(filePath, file.mimetype)

    // Update file with extracted text
    file.textContent = textContent
    file.processed = true
    await file.save()

    res.status(200).json({
      success: true,
      data: file,
    })
  } catch (error) {
    next(error)
  }
}
