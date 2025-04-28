import express from "express";
import { createSubject, deleteSubject, getSubjectById, getSubjects, updateSubject } from "../controllers/subjectController.js";

const router = express.Router();

router.post("/create", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.post("/update/:id", updateSubject);
router.post("/delete/:id", deleteSubject);

export default router;
