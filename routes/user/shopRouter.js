import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { userFindProducts, userFindSingleProduct } from '../../controllers/userProductController.js';

const router = express.Router();



router.get("/", authMiddleware , userFindProducts)
router.get("/:_id", authMiddleware , userFindSingleProduct)

export default router;
