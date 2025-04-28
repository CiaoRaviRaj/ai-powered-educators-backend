import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  gradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
    required: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  generationPrompt: {
    type: String,
    required: true,
  },
  additionalInformation: {
    type: String,
  },
  systemPrompt: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Course", courseSchema);
