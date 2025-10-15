import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Property title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  type: {
    type: String,
    required: [true, "Property type is required"],
    enum: {
      values: ["apartment", "duplex", "bungalow", "land", "house", "villa", "studio", "penthouse"],
      message: "Invalid property type"
    },
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["rent", "sell"],
      message: "Category must be either 'rent' or 'sell'"
    },
    lowercase: true
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  bedrooms: {
    type: Number,
    min: [0, "Bedrooms cannot be negative"],
    max: [20, "Bedrooms cannot exceed 20"],
    default: 0
  },
  bathrooms: {
    type: Number,
    min: [0, "Bathrooms cannot be negative"],
    max: [20, "Bathrooms cannot exceed 20"],
    default: 0
  },
  size: {
    type: Number,
    min: [0, "Size cannot be negative"],
    required: [true, "Size is required"]
  },
  images: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return v.length <= 10; // Max 10 images
      },
      message: "Cannot have more than 10 images"
    }
  }],
  features: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ["available", "sold", "rented", "pending"],
    default: "available",
    lowercase: true
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: "Invalid phone number format"
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format"
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
propertySchema.index({ location: 1, category: 1 });
propertySchema.index({ type: 1, category: 1 });
propertySchema.index({ price: 1, category: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ isActive: 1, status: 1 });

// Virtual for price per square foot
propertySchema.virtual("pricePerSqft").get(function() {
  return this.size > 0 ? Math.round(this.price / this.size) : 0;
});

// Virtual for formatted price
propertySchema.virtual("formattedPrice").get(function() {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0
  }).format(this.price);
});

// Pre-save middleware
propertySchema.pre("save", function(next) {
  // Ensure images array is not empty if provided
  if (this.images && this.images.length === 0) {
    this.images = [];
  }
  next();
});

// Static methods
propertySchema.statics.findAvailable = function() {
  return this.find({ isActive: true, status: "available" });
};

propertySchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

// Instance methods
propertySchema.methods.markAsSold = function() {
  this.status = "sold";
  return this.save();
};

propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

const Property = mongoose.model("Property", propertySchema);

export default Property;