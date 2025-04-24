import mongoose from "mongoose"

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a content title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    contentType: {
      type: String,
      enum: ["assignment", "rubric", "feedback", "instruction", "other"],
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
)

const Content = mongoose.model("Content", ContentSchema)

export default Content
