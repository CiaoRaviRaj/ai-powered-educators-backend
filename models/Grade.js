import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  systemPrompt: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Grade", gradeSchema);
