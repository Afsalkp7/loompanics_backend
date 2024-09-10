import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { userFindProducts } from '../../controllers/userProductController.js';

const router = express.Router();



router.get("/", authMiddleware , userFindProducts)

export default router;
