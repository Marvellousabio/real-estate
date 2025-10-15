import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";
import { upload } from "../config/storage.js";
import { protect, ownerOrAdmin } from "../middleware/auth.js";

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
router.get("/", async (req, res, next) => {
  try {
    const { published, limit, page, search } = req.query;

    let query = {};

    // Filter by published status
    if (published !== undefined) {
      query.published = published === "true";
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 10, 50), // Max 50 per page
      sort: { createdAt: -1 },
      select: "-__v"
    };

    const result = await Blog.paginate(query, options);

    res.status(200).json({
      success: true,
      data: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        pages: result.totalPages,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blog/:id - Get single blog by ID
router.get("/:id", validateBlogId, getBlogById);

// POST /api/blog - Create new blog (Protected)
router.post("/", protect, upload.single("image"), createBlog);

// PUT /api/blog/:id - Update blog (Protected - Owner or Admin)
router.put("/:id", validateBlogId, protect, ownerOrAdmin("author"), upload.single("image"), updateBlog);

// DELETE /api/blog/:id - Delete blog (Protected - Owner or Admin)
router.delete("/:id", validateBlogId, protect, ownerOrAdmin("author"), deleteBlog);

// GET /api/blog/slug/:slug - Get blog by slug
router.get("/slug/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true
    }).select("-__v");

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found"
      });
    }

    // Increment views
    await blog.incrementViews();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
});

export default router;
