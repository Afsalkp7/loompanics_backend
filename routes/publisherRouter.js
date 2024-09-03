import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { addPublisher, deletePublisher, findPublishers, findSinglePublishers, updateSinglePublishers } from '../controllers/adminPublisherController.js';
const router = express.Router();


// Add category
router.post('/', adminAuthMiddleware, addPublisher);
// Get all category
router.get('/', adminAuthMiddleware, findPublishers);
// Get single category
router.get('/:id', adminAuthMiddleware, findSinglePublishers);
// update single category
router.put('/:id', adminAuthMiddleware, updateSinglePublishers);
// delete category
router.delete('/:id', adminAuthMiddleware, deletePublisher);

export default router;