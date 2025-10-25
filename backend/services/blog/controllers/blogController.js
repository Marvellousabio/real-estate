import Blog from "../models/Blog.js";

// Get all blogs
export const getBlogs = async (req, res, next) => {
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
      select: "-__v",
      populate: { path: 'author', select: 'name email' }
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
};

// Get single blog by ID
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .select("-__v");

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
};

// Get blog by slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true
    })
    .populate('author', 'name email')
    .select("-__v");

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
};

// Create new blog
export const createBlog = async (req, res, next) => {
  try {
    console.log("createBlog called with req.body:", req.body);
    console.log("req.user:", req.user);
    console.log("req.file:", req.file);

    const { title, excerpt, content } = req.body;

    // Validation
    if (!title?.trim() || !content?.trim()) {
      console.log("Validation failed: title or content missing");
      return res.status(400).json({
        success: false,
        error: "Title and content are required"
      });
    }

    console.log("Creating new blog with data:", {
      title: title.trim(),
      excerpt: excerpt?.trim() || "",
      content: content.trim(),
      image: req.file?.path || "",
      author: req.user._id
    });

    const newBlog = new Blog({
      title: title.trim(),
      excerpt: excerpt?.trim() || "",
      content: content.trim(),
      image: req.file?.path || "",
      author: req.user._id
    });

    console.log("Saving blog...");
    const savedBlog = await newBlog.save();
    console.log("Blog saved successfully:", savedBlog._id);

    console.log("Populating author...");
    await savedBlog.populate('author', 'name email');
    console.log("Author populated successfully");

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog
    });
  } catch (error) {
    console.log("Error in createBlog:", error);
    console.log("Error type:", typeof error);
    console.log("Error properties:", Object.keys(error));
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
    )
    .populate('author', 'name email')
    .select("-__v");

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