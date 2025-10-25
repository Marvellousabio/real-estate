import express from 'express';
import authRoutes from './authRouter.js';
import propertyRoutes from './route.js';
import favoriteRoutes from './favorites.js';
import adminRoutes from './admin.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/admin', adminRoutes);

export default router;