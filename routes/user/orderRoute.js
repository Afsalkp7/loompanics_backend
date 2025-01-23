import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { placeOrder } from '../../controllers/userOrderController.js';

const router = express.Router();

router.post("/", authMiddleware , placeOrder)

export default router;