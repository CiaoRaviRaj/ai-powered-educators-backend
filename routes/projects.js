import express from "express"
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMessageToProject,
} from "../controllers/projects.js"

const router = express.Router()

router.post("/", createProject)
router.get("/", getProjects)
router.get("/:id", getProject)
router.put("/:id", updateProject)
router.delete("/:id", deleteProject)
router.post("/:id/messages", addMessageToProject)

export default router
