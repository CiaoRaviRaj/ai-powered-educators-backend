import mongoose from "mongoose";

const AssignmentSubCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("AssignmentSubCategory", AssignmentSubCategorySchema);