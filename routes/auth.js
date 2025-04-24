import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.post("/logout", verifyToken, logout);
router.put("/update-profile", verifyToken, updateProfile);

export default router;
