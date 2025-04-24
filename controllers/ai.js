import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import File from "../models/File.js"
import Project from "../models/Project.js"
import Content from "../models/Content.js"
import { createError } from "../utils/error.js"

// @desc    Generate content using AI
// @route   POST /api/ai/generate
// @access  Private
export const generateContent = async (req, res, next) => {
  try {
    const { prompt, projectId, contentType, systemPrompt } = req.body

    if (!prompt) {
      return next(createError(400, "Please provide a prompt"))
    }

    // Check if project exists and user owns it
    if (projectId) {
      const project = await Project.findById(projectId)
      if (!project) {
        return next(createError(404, "Project not found"))
      }

      if (project.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(createError(403, "Not authorized to generate content for this project"))
      }
    }

    // Generate content using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        systemPrompt || "You are an AI assistant for educators, helping to generate high-quality educational content.",
    })

    // Create content in database if projectId is provided
    let content = null
    if (projectId) {
      content = await Content.create({
        title: `Generated ${contentType || "content"}`,
        content: text,
        contentType: contentType || "other",
        project: projectId,
        user: req.user.id,
        prompt,
      })

      // Add content to project
      await Project.findByIdAndUpdate(projectId, {
        $push: { generatedContent: content._id },
      })

      // Add message to project
      await Project.findByIdAndUpdate(projectId, {
        $push: {
          messages: {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
          },
        },
      })

      await Project.findByIdAndUpdate(projectId, {
        $push: {
          messages: {
            role: "assistant",
            content: text,
            timestamp: Date.now(),
          },
        },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        generatedContent: text,
        contentRecord: content,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Analyze file content using AI
// @route   POST /api/ai/analyze-file/:fileId
// @access  Private
export const analyzeFile = async (req, res, next) => {
  try {
    const { fileId } = req.params
    const { prompt, projectId } = req.body

    // Get file
    const file = await File.findById(fileId)
    if (!file) {
      return next(createError(404, "File not found"))
    }

    // Check if user owns the file
    if (file.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to analyze this file"))
    }

    // Check if file has been processed
    if (!file.textContent) {
      return next(createError(400, "File has not been processed yet. Please process the file first."))
    }

    // Generate analysis using AI
    const analysisPrompt = prompt || "Analyze the following document and provide insights:"
    const fullPrompt = `${analysisPrompt}\n\n${file.textContent}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: fullPrompt,
      system:
        "You are an AI assistant for educators, helping to analyze educational content and provide valuable insights.",
    })

    // Create content in database if projectId is provided
    let content = null
    if (projectId) {
      content = await Content.create({
        title: `Analysis of ${file.originalName}`,
        content: text,
        contentType: "other",
        project: projectId,
        user: req.user.id,
        prompt: fullPrompt,
        metadata: {
          fileId: file._id,
          fileName: file.originalName,
        },
      })

      // Add content to project
      await Project.findByIdAndUpdate(projectId, {
        $push: { generatedContent: content._id },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        analysis: text,
        contentRecord: content,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate feedback for student work
// @route   POST /api/ai/generate-feedback
// @access  Private
export const generateFeedback = async (req, res, next) => {
  try {
    const { studentWork, rubric, projectId, gradeLevel, subject } = req.body

    if (!studentWork) {
      return next(createError(400, "Please provide student work"))
    }

    // Build prompt
    let prompt = `Generate constructive feedback for the following student work:\n\n${studentWork}\n\n`

    if (rubric) {
      prompt += `Based on this rubric:\n${rubric}\n\n`
    }

    if (gradeLevel) {
      prompt += `This is for a ${gradeLevel} student. `
    }

    if (subject) {
      prompt += `The subject is ${subject}. `
    }

    prompt += "Provide specific, actionable feedback that highlights strengths and areas for improvement."

    // Generate feedback using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: "You are an experienced educator providing constructive feedback to help students improve their work.",
    })

    // Create content in database if projectId is provided
    let content = null
    if (projectId) {
      content = await Content.create({
        title: "Student Feedback",
        content: text,
        contentType: "feedback",
        project: projectId,
        user: req.user.id,
        prompt,
        metadata: {
          gradeLevel,
          subject,
        },
      })

      // Add content to project
      await Project.findByIdAndUpdate(projectId, {
        $push: { generatedContent: content._id },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        feedback: text,
        contentRecord: content,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate rubric
// @route   POST /api/ai/generate-rubric
// @access  Private
export const generateRubric = async (req, res, next) => {
  try {
    const { assignment, projectId, gradeLevel, subject, criteria } = req.body

    if (!assignment) {
      return next(createError(400, "Please provide assignment details"))
    }

    // Build prompt
    let prompt = `Generate a detailed rubric for the following assignment:\n\n${assignment}\n\n`

    if (gradeLevel) {
      prompt += `This is for ${gradeLevel} students. `
    }

    if (subject) {
      prompt += `The subject is ${subject}. `
    }

    if (criteria && criteria.length > 0) {
      prompt += `Include the following criteria in the rubric: ${criteria.join(", ")}. `
    }

    prompt += "The rubric should include clear criteria, performance levels, and descriptions for each level."

    // Generate rubric using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: "You are an experienced educator creating clear and comprehensive rubrics for student assessment.",
    })

    // Create content in database if projectId is provided
    let content = null
    if (projectId) {
      content = await Content.create({
        title: "Assignment Rubric",
        content: text,
        contentType: "rubric",
        project: projectId,
        user: req.user.id,
        prompt,
        metadata: {
          gradeLevel,
          subject,
          criteria,
        },
      })

      // Add content to project
      await Project.findByIdAndUpdate(projectId, {
        $push: { generatedContent: content._id },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        rubric: text,
        contentRecord: content,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate assignment
// @route   POST /api/ai/generate-assignment
// @access  Private
export const generateAssignment = async (req, res, next) => {
  try {
    const { topic, projectId, gradeLevel, subject, learningObjectives, difficulty, format } = req.body

    if (!topic) {
      return next(createError(400, "Please provide a topic"))
    }

    // Build prompt
    let prompt = `Generate a comprehensive assignment on the topic of "${topic}".\n\n`

    if (gradeLevel) {
      prompt += `This is for ${gradeLevel} students. `
    }

    if (subject) {
      prompt += `The subject is ${subject}. `
    }

    if (learningObjectives && learningObjectives.length > 0) {
      prompt += `The learning objectives are: ${learningObjectives.join(", ")}. `
    }

    if (difficulty) {
      prompt += `The difficulty level should be ${difficulty}. `
    }

    if (format) {
      prompt += `The assignment format should be ${format}. `
    }

    prompt += "Include clear instructions, requirements, and any necessary resources or references."

    // Generate assignment using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: "You are an experienced educator creating engaging and educational assignments for students.",
    })

    // Create content in database if projectId is provided
    let content = null
    if (projectId) {
      content = await Content.create({
        title: `${topic} Assignment`,
        content: text,
        contentType: "assignment",
        project: projectId,
        user: req.user.id,
        prompt,
        metadata: {
          gradeLevel,
          subject,
          learningObjectives,
          difficulty,
          format,
        },
      })

      // Add content to project
      await Project.findByIdAndUpdate(projectId, {
        $push: { generatedContent: content._id },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        assignment: text,
        contentRecord: content,
      },
    })
  } catch (error) {
    next(error)
  }
}
