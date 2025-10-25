import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['apartment', 'house', 'duplex', 'bungalow', 'land', 'villa', 'studio', 'penthouse', 'office', 'shop'],
      message: 'Invalid property type',
    },
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['rent', 'sell'],
      message: 'Category must be either rent or sell',
    },
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    default: 'NGN',
    enum: ['NGN', 'USD', 'EUR'],
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      default: 'Nigeria',
      trim: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function(v) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates',
        },
      },
    },
  },
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative'],
    max: [50, 'Bedrooms cannot exceed 50'],
    default: 0,
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative'],
    max: [50, 'Bathrooms cannot exceed 50'],
    default: 0,
  },
  size: {
    type: Number,
    required: [true, 'Size is required'],
    min: [1, 'Size must be at least 1 sq ft'],
  },
  sizeUnit: {
    type: String,
    default: 'sqft',
    enum: ['sqft', 'sqm', 'acres', 'hectares'],
  },
  images: [{
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    alt: {
      type: String,
      trim: true,
    },
  }],
  features: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  amenities: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending', 'draft'],
    default: 'available',
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  favorites: {
    type: Number,
    default: 0,
    min: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: 'Invalid phone number format',
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
  },
  metadata: {
    yearBuilt: Number,
    parkingSpaces: Number,
    floorNumber: Number,
    totalFloors: Number,
    furnished: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished'],
    },
    petFriendly: Boolean,
    smokingAllowed: Boolean,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ type: 1, category: 1 });
propertySchema.index({ price: 1, category: 1 });
propertySchema.index({ status: 1, isActive: 1 });
propertySchema.index({ isFeatured: 1, createdAt: -1 });
propertySchema.index({ user: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ title: 'text', description: 'text' });

// Virtual for price per square foot/unit
propertySchema.virtual('pricePerUnit').get(function() {
  return this.size > 0 ? Math.round(this.price / this.size) : 0;
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: this.currency,
    minimumFractionDigits: 0,
  }).format(this.price);
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state}, ${this.location.country}`;
});

// Pre-save middleware
propertySchema.pre('save', function(next) {
  // Ensure at least one image is marked as primary if images exist
  if (this.images && this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }

  // Set default coordinates if not provided
  if (!this.location.coordinates.coordinates || this.location.coordinates.coordinates.length !== 2) {
    // Default to Lagos, Nigeria coordinates
    this.location.coordinates.coordinates = [3.3792, 6.5244];
  }

  next();
});

// Instance methods
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

propertySchema.methods.incrementFavorites = function() {
  this.favorites += 1;
  return this.save({ validateBeforeSave: false });
};

propertySchema.methods.decrementFavorites = function() {
  this.favorites = Math.max(0, this.favorites - 1);
  return this.save({ validateBeforeSave: false });
};

propertySchema.methods.markAsSold = function() {
  this.status = 'sold';
  return this.save();
};

propertySchema.methods.markAsRented = function() {
  this.status = 'rented';
  return this.save();
};

// Static methods
propertySchema.statics.findAvailable = function() {
  return this.find({ isActive: true, status: 'available' });
};

propertySchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

propertySchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true, status: 'available' });
};

propertySchema.statics.findByLocation = function(city, state) {
  return this.find({
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    isActive: true,
  });
};

const Property = mongoose.model('Property', propertySchema);

export default Property;