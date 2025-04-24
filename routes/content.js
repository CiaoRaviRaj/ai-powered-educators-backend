import express from "express"
import {
  createContent,
  getContents,
  getContent,
  updateContent,
  deleteContent,
  downloadContent,
} from "../controllers/content.js"

const router = express.Router()

router.post("/", createContent)
router.get("/", getContents)
router.get("/:id", getContent)
router.put("/:id", updateContent)
router.delete("/:id", deleteContent)
router.get("/:id/download", downloadContent)

export default router
