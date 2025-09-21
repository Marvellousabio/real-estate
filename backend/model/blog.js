import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: String,
    content: { type: String, required: true },
    image: String,
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
