import express from 'express';
import { addToCart, deleteCart, getCart, updateQuantity } from '../../controllers/cartController.js';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';


const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/',authMiddleware,getCart)
router.delete('/',authMiddleware,deleteCart)
router.put('/',authMiddleware,updateQuantity)

export default router;
