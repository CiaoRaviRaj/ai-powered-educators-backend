import mongoose from "mongoose"

const FileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
    },
    path: {
      type: String,
      required: [true, "File path is required"],
    },
    mimetype: {
      type: String,
      required: [true, "File mimetype is required"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    textContent: {
      type: String,
      default: null,
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const File = mongoose.model("File", FileSchema)

export default File
