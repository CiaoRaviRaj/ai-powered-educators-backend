import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  systemPrompt: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Subject", subjectSchema);
