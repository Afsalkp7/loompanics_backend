import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { getUserProfile } from '../../controllers/profileController.js';


const router = express.Router();

router.get('/', authMiddleware, getUserProfile);

export default router;
