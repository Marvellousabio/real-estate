import React, { useState } from "react";
import { Upload } from "lucide-react";
import { createBlog } from "../services/api"; // ✅ centralized API functions

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await createBlog(formData);
      console.log("Blog created:", res);

      // Reset
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setMessage("✅ Blog published successfully!");
    } catch (err) {
      console.error("Error creating blog:", err);
      setMessage("❌ Failed to publish blog. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          ✍️ Create a New Blog
        </h2>

        {message && (
          <p
            className={`text-center font-medium text-sm mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Blog Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Title
          </label>
          <input
            type="text"
            placeholder="Enter your blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Blog Excerpt */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Short Excerpt
          </label>
          <input
            type="text"
            placeholder="A short summary for your blog"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Blog Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Content
          </label>
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
              <Upload size={18} /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-60"
        >
          {uploading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
