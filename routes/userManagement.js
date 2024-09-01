import express from 'express';
import { findUsers } from '../controllers/userController.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
const router = express.Router();

//  Get all users
router.get("/",adminAuthMiddleware,findUsers)
export default router;