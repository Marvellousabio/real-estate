import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";


const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading,setUploading]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("image", image);
    
    
    try {
      const res = await axios.post("/api/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Blog created:", res.data);

      // Reset
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage(null);
      setPreview(null);
        setUploading(false);
    } catch (err) {
      console.error("Error creating blog:", err);
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
            className="w-full border rounded-lg px-4 py-2 h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            required
          />
        </div>

        {/* Blog Image Upload (styled like property upload) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Cover Image
          </label>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
            onClick={() => document.getElementById("blogImageInput").click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-600">Click to upload cover image</p>
                <p className="text-sm text-gray-400">(JPEG, PNG, etc.)</p>
              </>
            )}
          </div>

          <input
            type="file"
            id="blogImageInput"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled = {uploading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >{uploading ? "Uploading..." : "🚀 Publish Blog"}
          
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
