
import Blog from "../model/blog.js";

// Get all blogs
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by ID
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).select("-__v");

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Create new blog
export const createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content } = req.body;

    // Validation
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required"
      });
    }

    const newBlog = new Blog({
      title: title.trim(),
      excerpt: excerpt?.trim() || "",
      content: content.trim(),
      image: req.file?.path || "",
      author: req.user._id // Associate with authenticated user
    });

    const savedBlog = await newBlog.save();
    await savedBlog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog
    });
  } catch (error) {
    next(error);
  }
};

// Update existing blog
export const updateBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content } = req.body;
    const updateData = {};

    // Build update object with validation
    if (title !== undefined) {
      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          error: "Title cannot be empty"
        });
      }
      updateData.title = title.trim();
    }

    if (excerpt !== undefined) {
      updateData.excerpt = excerpt?.trim() || "";
    }

    if (content !== undefined) {
      if (!content?.trim()) {
        return res.status(400).json({
          success: false,
          error: "Content cannot be empty"
        });
      }
      updateData.content = content.trim();
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-__v");

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error) {
    next(error);
  }
};

// Delete blog
export const deleteBlog = async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
