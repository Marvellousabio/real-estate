import Blog from "../model/blog.js";

// Get all blogs
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// Get single blog
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Create blog
export const createBlog = async (req, res, next) => {
  try {
    console.log("📥 Incoming blog data:", req.body);
    console.log("📸 File info:", req.file);
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newBlog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      image: req.file?.path || "",
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    next(err);
  }
};

// Update blog
export const updateBlog = async (req, res, next) => {
  try {
    const updateData = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
    };

    if (req.file) updateData.image = req.file.path;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });

    res.json(updatedBlog);
  } catch (err) {
    next(err);
  }
};

// Delete blog
export const deleteBlog = async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};
