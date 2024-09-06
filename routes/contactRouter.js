import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { addMessage } from '../controllers/contactUsCotroller.js';
const router = express.Router();

router.post("/",authMiddleware,addMessage)

export default router;