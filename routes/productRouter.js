import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import upload from '../middlewares/multerConfig.js';
import { addProduct, findProducts } from '../controllers/adminProductController.js';

const router = express.Router();

// Correct field name 'publisherLogo' should match the field name used in frontend
router.post('/', adminAuthMiddleware, upload.fields([
    { name: 'primaryImage', maxCount: 1 }, 
    { name: 'secondaryImage', maxCount: 1 }, 
    { name: 'thirdImage', maxCount: 1 }
  ]) , addProduct);

  router.get("/", adminAuthMiddleware , findProducts)


export default router;