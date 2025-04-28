import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    assignmentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentCategory",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    learningObjectivesDescription: {
      type: String,
      default: "",
    },
    // Integration platforms
    canvas: {
      type: Boolean,
      default: false,
    },
    google: {
      type: Boolean,
      default: false,
    },
    googleMeet: {
      type: Boolean,
      default: false,
    },
    // AI generation configuration
    systemPrompt: {
      type: String,
      required: true,
    },
    // // Assignment status
    // status: {
    //   type: String,
    //   enum: ["draft", "published", "archived"],
    //   default: "draft",
    // },
    // Points/Grading
    totalPoints: {
      type: Number,
      default: 100,
    },
    // Access control
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },




  },
  {
    timestamps: true,
    // Add indexes for common queries
    indexes: [
      { userId: 1 },
      { courseId: 1 },
      { assignmentCategoryId: 1 },
      { dueDate: 1 },
      // { status: 1 },
    ]
  }
);

// Prevent overwriting model
const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default Assignment;