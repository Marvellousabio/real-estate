import express from "express";
import Property from "../model/property.js";
import { protect, ownerOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validatePropertyData = (req, res, next) => {
  const { title, type, category, location, price, size } = req.body;

  const errors = [];

  if (!title?.trim()) errors.push("Title is required");
  if (!type) errors.push("Property type is required");
  if (!category || !["rent", "sell"].includes(category)) {
    errors.push("Valid category (rent/sell) is required");
  }
  if (!location?.trim()) errors.push("Location is required");
  if (!price || price < 0) errors.push("Valid price is required");
  if (!size || size <= 0) errors.push("Valid size is required");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors
    });
  }

  next();
};

// GET /api/properties - Get properties with advanced filtering and pagination
router.get("/", async (req, res, next) => {
  try {
    const {
      category,
      type,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minSize,
      maxSize,
      search,
      sortBy = "newest",
      status = "available",
      page = 1,
      limit = 12,
      myProperties = false // New parameter to get user's own properties
    } = req.query;

    let query = { isActive: true };

    // If user is authenticated and requests their own properties
    if (req.user && myProperties === "true") {
      query.user = req.user._id;
    }

    // Category filter
    if (category) {
      query.category = category.toLowerCase();
    }

    // Property type filter
    if (type) {
      query.type = type.toLowerCase();
    }

    // Location filter (case-insensitive partial match)
    if (location) {
      query.location = new RegExp(location.trim(), "i");
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Bedrooms filter (minimum)
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }

    // Bathrooms filter (minimum)
    if (bathrooms) {
      query.bathrooms = { $gte: parseInt(bathrooms) };
    }

    // Size range filter
    if (minSize || maxSize) {
      query.size = {};
      if (minSize) query.size.$gte = parseFloat(minSize);
      if (maxSize) query.size.$lte = parseFloat(maxSize);
    }

    // Status filter
    if (status) {
      query.status = status.toLowerCase();
    }

    // Search across multiple fields
    if (search) {
      query.$or = [
        { title: new RegExp(search.trim(), "i") },
        { description: new RegExp(search.trim(), "i") },
        { location: new RegExp(search.trim(), "i") },
        { type: new RegExp(search.trim(), "i") }
      ];
    }

    // Sorting options
    let sort = {};
    switch (sortBy) {
      case "price-low":
        sort.price = 1;
        break;
      case "price-high":
        sort.price = -1;
        break;
      case "size-small":
        sort.size = 1;
        break;
      case "size-large":
        sort.size = -1;
        break;
      case "bedrooms":
        sort.bedrooms = -1;
        break;
      case "newest":
      default:
        sort.createdAt = -1;
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // 1-50 items per page
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email') // Populate user info for myProperties
        .select("-__v"),
      Property.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        applied: Object.keys(query).length > 1, // More than just isActive
        query: { ...query, isActive: undefined }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/:id - Get single property
router.get("/:id", async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).select("-__v");

    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    // Increment views
    await property.incrementViews();

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/properties - Create new property (Protected)
router.post("/", protect, validatePropertyData, async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      location: req.body.location.trim(),
      images: req.body.images || [],
      features: req.body.features || [],
      user: req.user._id // Associate property with authenticated user
    };

    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    // Populate user data for response
    await savedProperty.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: savedProperty
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/properties/:id - Update property (Protected - Owner or Admin)
router.put("/:id", protect, ownerOrAdmin("user"), validatePropertyData, async (req, res, next) => {
  try {
    const updateData = {
      ...req.body,
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      location: req.body.location.trim(),
      updatedAt: new Date()
    };

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-__v");

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/properties/:id - Delete property (Protected - Owner or Admin)
router.delete("/:id", protect, ownerOrAdmin("user"), async (req, res, next) => {
  try {
    const deletedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedProperty) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/stats/summary - Get property statistics
router.get("/stats/summary", async (req, res, next) => {
  try {
    const stats = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          forSale: {
            $sum: { $cond: [{ $eq: ["$category", "sell"] }, 1, 0] }
          },
          forRent: {
            $sum: { $cond: [{ $eq: ["$category", "rent"] }, 1, 0] }
          },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      forSale: 0,
      forRent: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
