import express from "express";
import { createAssignment, getAllAssignments, getAssignmentById, updateAssignment, deleteAssignment } from "../controllers/assignmentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createAssignment);
router.get("/", verifyToken, getAllAssignments);
router.get("/:id", verifyToken, getAssignmentById);
router.post("/update/:id", verifyToken, updateAssignment);
router.post("/delete/:id", verifyToken, deleteAssignment);

export default router;
