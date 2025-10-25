import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST /api/favorites - Add favorite
router.post('/', addFavorite);

// GET /api/favorites - Get user's favorites
router.get('/', getFavorites);

// DELETE /api/favorites/:id - Remove favorite
router.delete('/:id', removeFavorite);

// GET /api/favorites/check/:propertyId - Check if property is favorited
router.get('/check/:propertyId', checkFavorite);

export default router;