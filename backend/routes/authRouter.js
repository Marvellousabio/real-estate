import express from "express";
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { protect, authRateLimit } from "../middleware/auth.js";

const router = express.Router();

// Public routes with rate limiting
router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);
router.post("/forgotpassword", authRateLimit, forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.get("/logout", protect, logout);

export default router;