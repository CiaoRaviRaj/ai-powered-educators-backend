import express from "express"
import {
  generateContent,
  analyzeFile,
  generateFeedback,
  generateRubric,
  generateAssignment,
} from "../controllers/ai.js"

const router = express.Router()

router.post("/generate", generateContent)
router.post("/analyze-file/:fileId", analyzeFile)
router.post("/generate-feedback", generateFeedback)
router.post("/generate-rubric", generateRubric)
router.post("/generate-assignment", generateAssignment)

export default router
