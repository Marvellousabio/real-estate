import express from "express";
import { upload } from "../config/storage.js";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const blogRouter = express.Router();

blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/", upload.single("image"), createBlog);
blogRouter.put("/:id", upload.single("image"), updateBlog);
blogRouter.delete("/:id", deleteBlog);

export default blogRouter;
