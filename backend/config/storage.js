import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Validate environment variables (optional for development)
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

// Debug logs removed after confirming env vars are loaded

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn(`⚠️  Missing Cloudinary environment variables: ${missingVars.join(", ")}`);
  console.warn("📁 File uploads will be disabled. Add environment variables to enable file uploads.");
}

// Configure Cloudinary (only if environment variables are available)
let cloudinaryConfigured = false;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  cloudinaryConfigured = true;
}

// File validation function
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"), false);
  }
};

// Create Cloudinary storage for blogs
const createBlogStorage = () => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "real-estate/blogs",
     upload_preset: "blog",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto", fetch_format: "auto" }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const filename = path.parse(file.originalname).name;
      return `blog-${timestamp}-${filename}`;
    }
  }
});

// Create Cloudinary storage for properties
const createPropertyStorage = () => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "real-estate/properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto", fetch_format: "auto" }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const filename = path.parse(file.originalname).name;
      return `property-${timestamp}-${filename}`;
    }
  }
});

// Create multer instances with limits
const createUploadMiddleware = (storage) => {
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 10 // Maximum 10 files
    }
  });
};

// Export configured upload middlewares
export const uploadBlogImage = createUploadMiddleware(createBlogStorage());
export const uploadPropertyImages = createUploadMiddleware(createPropertyStorage());

// Legacy export for backward compatibility
export const upload = uploadBlogImage;

// Export cloudinary instance for direct usage if needed
export { cloudinary };
