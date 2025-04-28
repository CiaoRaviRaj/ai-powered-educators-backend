import express from "express";
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from "../controllers/courseController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/create", verifyToken, createCourse);
router.get("/", verifyToken, getCourses);
router.get("/:id", verifyToken, getCourseById);
router.post("/update/:id", verifyToken, updateCourse);
router.post("/delete/:id", verifyToken, deleteCourse);

export default router;
