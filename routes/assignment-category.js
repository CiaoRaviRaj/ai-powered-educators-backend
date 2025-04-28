import express from "express";
import { createAssignmentCategory, deleteAssignmentCategory, getAllAssignmentCategories, getAssignmentCategoryById, updateAssignmentCategory } from "../controllers/assignmentCategoryController.js";

const router = express.Router();

router.post("/create", createAssignmentCategory);
router.get("/", getAllAssignmentCategories);
router.get("/:id", getAssignmentCategoryById);
router.post("/update/:id", updateAssignmentCategory);
router.post("/delete/:id", deleteAssignmentCategory);

export default router;
