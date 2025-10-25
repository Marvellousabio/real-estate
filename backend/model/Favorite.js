import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Compound index to ensure unique user-property pairs
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Index for efficient queries
favoriteSchema.index({ user: 1, createdAt: -1 });
favoriteSchema.index({ property: 1 });

// Pre-save middleware to prevent users from favoriting their own properties
favoriteSchema.pre('save', async function(next) {
  try {
    const Property = mongoose.model('Property');
    const property = await Property.findById(this.property);

    if (!property) {
      return next(new Error('Property not found'));
    }

    if (property.user.toString() === this.user.toString()) {
      return next(new Error('Cannot favorite your own property'));
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static methods
favoriteSchema.statics.findUserFavorites = function(userId, options = {}) {
  const { page = 1, limit = 12, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  return this.find({ user: userId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'property',
      match: { isActive: true },
      select: 'title price location images type category status',
    });
};

favoriteSchema.statics.isFavorited = function(userId, propertyId) {
  return this.findOne({ user: userId, property: propertyId });
};

favoriteSchema.statics.getFavoriteCount = function(propertyId) {
  return this.countDocuments({ property: propertyId });
};

favoriteSchema.statics.toggleFavorite = async function(userId, propertyId) {
  const existingFavorite = await this.findOne({ user: userId, property: propertyId });

  if (existingFavorite) {
    await this.deleteOne({ _id: existingFavorite._id });
    return { action: 'removed', favorite: null };
  } else {
    const favorite = await this.create({ user: userId, property: propertyId });
    return { action: 'added', favorite };
  }
};

// Instance methods
favoriteSchema.methods.toPublicData = function() {
  return {
    id: this._id,
    user: this.user,
    property: this.property,
    createdAt: this.createdAt,
  };
};

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;