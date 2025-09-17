// routes/blogRoutes.js
import express from "express";
import Blog from "../model/Blog.js";
import { upload } from "../config/storage.js";

const blogRouter = express.Router();

// Get all blogs
blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single blog by ID
blogRouter.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new blog (Admin use)
blogRouter.post("/", upload.single("image"), async (req, res) => {

  try {
    const newBlog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      image: req.file.path,  // Cloudinary gives URL in .path
      date: new Date(),
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// Update blog
blogRouter.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        image: req.file ? req.file.path : undefined, // keep old image if none uploaded
      },
      { new: true } // return updated document
    );

    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Delete blog
blogRouter.delete("/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});


export default blogRouter;
