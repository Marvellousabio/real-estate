import express from "express";
import {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";
import { upload } from "../../../config/storage.js";
import { protect, authorize } from "../../../shared/auth.js";

const router = express.Router();

// Validation middleware for blog ID
const validateBlogId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: "Invalid blog ID format"
    });
  }
  next();
};

// GET /api/blog - Get all blogs with optional filters
router.get("/", getBlogs);

// GET /api/blog/:id - Get single blog by ID
router.get("/:id", validateBlogId, getBlogById);

// GET /api/blog/slug/:slug - Get blog by slug
router.get("/slug/:slug", getBlogBySlug);

// POST /api/blog - Create new blog (Protected - Admin only)
router.post("/", protect, authorize("admin"), upload.single("image"), createBlog);

// PUT /api/blog/:id - Update blog (Protected - Admin only)
router.put("/:id", validateBlogId, protect, authorize("admin"), upload.single("image"), updateBlog);

// DELETE /api/blog/:id - Delete blog (Protected - Admin only)
router.delete("/:id", validateBlogId, protect, authorize("admin"), deleteBlog);

export default router;