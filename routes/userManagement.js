import express from 'express';
import { findSingleUser, findUsers, updateStatus } from '../controllers/userController.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
const router = express.Router();

//  Get all users
router.get("/",adminAuthMiddleware,findUsers)

// Get single user
router.get("/:id",adminAuthMiddleware,findSingleUser)


// Update user status
router.put("/:id",adminAuthMiddleware,updateStatus)

export default router;