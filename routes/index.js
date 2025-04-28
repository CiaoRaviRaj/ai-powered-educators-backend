// routes/index.js

import express from "express";
const router = express.Router();

import authRoutes from "./auth.js";
import projectRoutes from "./projects.js";
import contentRoutes from "./content.js";
import fileRoutes from "./files.js";
import aiRoutes from "./ai.js";
import gradesRoutes from "./grades.js";
import subjectsRoutes from "./subjects.js";
import coursesRoutes from "./courses.js";
import assignmentSubCategoryRoutes from "./assignment-sub-category.js";
import assignmentCategoryRoutes from "./assignment-category.js";
import assignmentRoutes from "./assignment.js";
// Mount the individual routers
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/content", contentRoutes);
router.use("/files", fileRoutes);
router.use("/ai", aiRoutes);
router.use("/grades", gradesRoutes);
router.use("/subjects", subjectsRoutes);
router.use("/courses", coursesRoutes);
router.use("/assignment-sub-category", assignmentSubCategoryRoutes);
router.use("/assignment-categories", assignmentCategoryRoutes);
router.use("/assignments", assignmentRoutes);
export default router;
