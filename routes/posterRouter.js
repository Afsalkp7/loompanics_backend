import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import upload from '../middlewares/multerConfig.js';
import { addPoster, findPosters } from '../controllers/adminPosterController.js';
const router = express.Router();


// Add category
router.post('/', adminAuthMiddleware,upload.single('posterImage'), addPoster);
// Get all category
router.get('/', adminAuthMiddleware, findPosters);


export default router;