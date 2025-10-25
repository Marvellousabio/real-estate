import express from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats
} from "../controllers/propertyController.js";
import { uploadPropertyImages } from "../../../config/storage.js";
import { protect, authorize, ownerOrAdmin } from "../../../shared/auth.js";

const router = express.Router();

// Validation middleware for property ID
const validatePropertyId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      error: "Invalid property ID format"
    });
  }
  next();
};

// GET /api/properties - Get properties with advanced filtering and pagination
router.get("/", getProperties);

// GET /api/properties/:id - Get single property
router.get("/:id", validatePropertyId, getPropertyById);

// POST /api/properties - Create new property (Protected - Agent/Admin)
router.post("/", protect, authorize("agent", "admin"), uploadPropertyImages.array("images", 10), createProperty);

// PUT /api/properties/:id - Update property (Protected - Owner or Admin)
router.put("/:id", validatePropertyId, protect, uploadPropertyImages.array("images", 10), updateProperty);

// DELETE /api/properties/:id - Delete property (Protected - Owner or Admin)
router.delete("/:id", validatePropertyId, protect, deleteProperty);

// GET /api/properties/stats/summary - Get property statistics
router.get("/stats/summary", getPropertyStats);

export default router;