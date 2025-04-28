import express from "express";
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory } from "../controllers/assignmentSubCategoryController.js";
const router = express.Router();

router.post("/create", createSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", getSubCategoryById);
router.post("/update/:id", updateSubCategory);
router.post("/delete/:id", deleteSubCategory);

export default router;
