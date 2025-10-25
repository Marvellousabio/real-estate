import Favorite from '../model/Favorite.js';

// @desc    Add a favorite
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;

    // Check if already favorited
    const existingFavorite = await Favorite.isFavorited(userId, propertyId);
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: 'Property is already in favorites',
      });
    }

    // Create favorite
    const favorite = await Favorite.create({ user: userId, property: propertyId });

    res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      data: {
        favorite: favorite.toPublicData(),
      },
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Remove a favorite
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const favoriteId = req.params.id;
    const userId = req.user._id;

    const favorite = await Favorite.findOneAndDelete({
      _id: favoriteId,
      user: userId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const favorites = await Favorite.findUserFavorites(userId, { page, limit });

    res.status(200).json({
      success: true,
      data: {
        favorites: favorites.filter(fav => fav.property), // Filter out if property is null
        pagination: {
          page,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Check if property is favorited by user
// @route   GET /api/favorites/check/:propertyId
// @access  Private
export const checkFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const favorite = await Favorite.isFavorited(userId, propertyId);

    res.status(200).json({
      success: true,
      data: {
        isFavorited: !!favorite,
        favoriteId: favorite ? favorite._id : null,
      },
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};