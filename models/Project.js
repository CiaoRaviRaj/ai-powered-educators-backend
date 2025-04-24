import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    gradeLevel: {
      type: String,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ["assignment", "rubric", "feedback", "instruction", "other"],
      default: "assignment",
    },
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    generatedContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
  },
  { timestamps: true },
)

const Project = mongoose.model("Project", ProjectSchema)

export default Project
