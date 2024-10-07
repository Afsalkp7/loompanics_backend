import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { addCategory, deleteCategory, findCategories, findSingleCategories, updateSingleCategories } from '../controllers/adminCategoryController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
const router = express.Router();


// Add category
router.post('/', adminAuthMiddleware, addCategory);
// Get all category
router.get('/', adminAuthMiddleware, findCategories);
// Get single category
router.get('/:id', adminAuthMiddleware, findSingleCategories);
// update single category
router.put('/:id', adminAuthMiddleware, updateSingleCategories);
// delete category
router.delete('/:id', adminAuthMiddleware, deleteCategory);

export default router;