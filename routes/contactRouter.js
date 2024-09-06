import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
const router = express.Router();

router.post("/",authMiddleware,)

export default router;