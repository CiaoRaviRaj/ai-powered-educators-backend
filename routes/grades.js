import express from "express";
import { createGrade, deleteGrade, getGradeById, getGrades, updateGrade } from "../controllers/gradeController.js";

const router = express.Router();

router.post("/create", createGrade);
router.get("/", getGrades);
router.get("/:id", getGradeById);
router.post("/update/:id", updateGrade);
router.post("/delete/:id", deleteGrade);

export default router;
