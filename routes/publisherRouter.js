import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import upload from '../middlewares/multerConfig.js';
import {
  addPublisher,
  deletePublisher,
  findPublishers,
  findSinglePublishers,
  updateSinglePublishers,
} from '../controllers/adminPublisherController.js';

const router = express.Router();

// Correct field name 'publisherLogo' should match the field name used in frontend
router.post('/', adminAuthMiddleware, upload.single('publisherLogo'), addPublisher);
router.get('/', adminAuthMiddleware, findPublishers);
router.get('/:id', adminAuthMiddleware, findSinglePublishers);
router.put('/:id', adminAuthMiddleware, upload.single('publisherLogo'), updateSinglePublishers);
router.delete('/:id', adminAuthMiddleware, deletePublisher);

export default router;
