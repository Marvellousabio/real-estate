import React, { useState, useCallback } from "react";
import { createProperty } from "../services/api";
import CustomAlert from "../components/CustomAlert";
import { FaCloudUploadAlt, FaTimes, FaCheck } from "react-icons/fa";

export const AddProperty = () => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const showAlert = useCallback((message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    images: [],
  });

  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // File validation
  const validateFile = useCallback((file) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      showAlert("Only PNG, JPG, and WebP files are allowed.", "error");
      return false;
    }
    if (file.size > maxSize) {
      showAlert("File size exceeds 5MB.", "error");
      return false;
    }
    return true;
  }, [showAlert]);

  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files).filter(validateFile);
    setFiles(prevFiles => {
      const combined = [...prevFiles, ...newFiles];
      const unique = combined.filter(
        (file, index, arr) =>
          arr.findIndex(f => f.name === file.name && f.lastModified === file.lastModified) === index
      );
      return unique.slice(0, 10); // max 10 files
    });
  }, [validateFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(validateFile);
    setFiles(prevFiles => {
      const combined = [...prevFiles, ...droppedFiles];
      const unique = combined.filter(
        (file, index, arr) =>
          arr.findIndex(f => f.name === file.name && f.lastModified === file.lastModified) === index
      );
      return unique.slice(0, 10);
    });
  }, [validateFile]);

  const handleDragOver = useCallback((e) => e.preventDefault(), []);
  const handleDragEnter = useCallback(() => setIsDragging(true), []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const removeFile = useCallback((indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const uploadImages = useCallback(async () => {
    if (files.length === 0) {
      showAlert("Please upload at least one image.", "error");
      return [];
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      showAlert("Cloudinary configuration missing.", "error");
      return [];
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.error) {
          throw new Error(result.error.message);
        }

        return result.secure_url;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Upload error:", error);
      showAlert(`Image upload failed: ${error.message}`, "error");
      return [];
    } finally {
      setUploading(false);
    }
  }, [files, CLOUD_NAME, UPLOAD_PRESET, showAlert]);

    

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.location.trim() || !formData.category) {
      showAlert("Please fill in all required fields.", "error");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      showAlert("Please enter a valid price.", "error");
      return;
    }

    try {
      const imageUrls = await uploadImages();
      if (imageUrls.length === 0) return;

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        size: Number(formData.size),
        images: imageUrls,
      };

      const response = await createProperty(payload);

      if (response?.data) {
        showAlert("Property added successfully!", "success");

        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "",
          category: "",
          location: "",
          price: "",
          bedrooms: "",
          bathrooms: "",
          size: "",
          images: [],
        });
        setFiles([]);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showAlert(
        error.response?.data?.error || "Failed to add property. Please try again.",
        "error"
      );
    }
  }, [formData, uploadImages, showAlert]);


  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add New Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter property title"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2  focus:ring-green-600"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter property location"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2  focus:ring-green-600"
          />
        </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2  focus:ring-green-600"
          />
        </div>
        {/* Category */}
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
            id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select category</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          </div>

          

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Bedrooms</label>
            <input
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="No. of bedrooms"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2  focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Bathrooms</label>
            <input
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="No. of bathrooms"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        
          <div className="grid grid-cols-2 gap-4">
          <div>
          <label className="block text-gray-700 mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Select type</option>
            <option value="apartment">Apartment</option>
            <option value="duplex">Duplex</option>
            <option value="bungalow">Bungalow</option>
            <option value="land">Land</option>
          </select>
        </div>
          {/* Size */}
        <div>
          <label className="block text-gray-700 mb-2">Size (sqft)</label>
          <input
            name="size"
            type="number"
            value={formData.size}
            onChange={handleChange}
            placeholder="Enter size in sqft"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter property description"
            className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-green-600"
          ></textarea>
        </div>

         {/* Image Upload */}
        {/* Image Upload */}
<div >
  <label className="block text-gray-700 mb-2 font-medium">
    Upload Images (max 5)
  </label>

  <div
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onDragEnter={handleDragEnter}
  onDragLeave={handleDragLeave}
  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
    isDragging ? "border-green-600 bg-green-50" : "border-green-300"}`
  }>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleFileChange}
      className="hidden"
      id="imageUpload"
    />
    <label
      htmlFor="imageUpload"
      className="flex flex-col items-center cursor-pointer"
    >
      <svg
        className="w-10 h-10 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6H17a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <span className="text-gray-600">
        Click to <span className="text-green-600 font-semibold">Upload</span> or drag & drop
      </span>
      <span className="text-sm text-gray-400">PNG, JPG up to 5 files</span>
    </label>
  </div>

  {/* Preview */}
  {files.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
      {files.map((file, idx) => (
        <div key={idx} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${idx + 1}`}
            className="h-20 w-full object-cover rounded-lg shadow-md border"
          />
          <button
            onClick={() => removeFile(idx)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove image ${idx + 1}`}
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
        

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <FaCheck className="text-sm" />
              Add Property
            </>
          )}
        </button>
      </form>
      {alert.message && (
          <CustomAlert
           message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
          />
        )}
    </div>
  );
}
