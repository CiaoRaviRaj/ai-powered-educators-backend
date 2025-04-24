import express from "express"
import { uploadFile, getFiles, getFile, deleteFile, downloadFile, processFile } from "../controllers/files.js"

const router = express.Router()

router.post("/upload", uploadFile)
router.get("/", getFiles)
router.get("/:id", getFile)
router.delete("/:id", deleteFile)
router.get("/:id/download", downloadFile)
router.post("/:id/process", processFile)

export default router
