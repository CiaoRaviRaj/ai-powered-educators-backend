import mongoose from "mongoose";

const assignmentCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    assignmentSubCategoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssignmentSubCategory",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("AssignmentCategory", assignmentCategorySchema);
