import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getAllProperties,
  getAllBlogs,
  deleteUser,
  deleteProperty,
  deleteBlog,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Property management routes
router.get('/properties', getAllProperties);
router.delete('/properties/:id', deleteProperty);

// Blog management routes
router.get('/blogs', getAllBlogs);
router.delete('/blogs/:id', deleteBlog);

export default router;