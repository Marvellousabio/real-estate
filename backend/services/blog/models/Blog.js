import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"]
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true
    },
    image: {
      type: String,
      default: "",
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    published: {
      type: Boolean,
      default: true
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"]
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ slug: 1 });

// Virtual for reading time estimation
blogSchema.virtual("readingTime").get(function() {
  const wordsPerMinute = 200;
  const words = this.content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
});

// Pre-save middleware to generate slug
blogSchema.pre("save", function(next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
  }
  next();
});

// Static method to find published blogs
blogSchema.statics.findPublished = function() {
  return this.find({ published: true }).sort({ createdAt: -1 });
};

// Instance method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Apply the paginate plugin
blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;