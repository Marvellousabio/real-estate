import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateBlog, deleteBlog, getBlogById } from "../services/api";

const BlogActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch blog details to pre-fill form
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogById(id);
        setFormData({
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          image: null, // don't auto-fill file input
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to load blog data ❌");
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Update blog
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("excerpt", formData.excerpt);
      fd.append("content", formData.content);
      if (formData.image) fd.append("image", formData.image);

      await updateBlog(id, fd);
      alert("Blog updated successfully ✅");
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Failed to update blog ❌");
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(id);
      alert("Blog deleted successfully ✅");
      navigate("/blogs"); // redirect to blogs list
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog ❌");
    }
  };

  if (fetching) return <p className="text-center mt-20">Loading blog data...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="excerpt"
          placeholder="Excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full border p-2 rounded h-40"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Blog
      </button>
    </div>
  );
};

export default BlogActions;
