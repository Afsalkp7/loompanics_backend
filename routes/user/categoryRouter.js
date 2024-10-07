import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { findCategories } from '../../controllers/categoryController.js';

const router = express.Router();

router.get("/", authMiddleware , findCategories)

export default router;
