import express from 'express';
import { addToCart, getCart } from '../../controllers/cartController.js';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';


const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/',authMiddleware,getCart)

export default router;
