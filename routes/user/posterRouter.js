import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { findPosters } from '../../controllers/posterController.js';

const router = express.Router();

router.get("/", authMiddleware , findPosters)

export default router;