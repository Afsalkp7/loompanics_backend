import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import upload from '../middlewares/multerConfig.js';
import { addAuthor, findAuthors } from '../controllers/authorController.js';
const router = express.Router();

//  Get all users
router.get("/",adminAuthMiddleware,findAuthors)

// // Get single user
// router.get("/:id",adminAuthMiddleware,findSingleUser)


// // Update user status
// router.put("/:id",adminAuthMiddleware,updateStatus)

// Add author

router.post('/', adminAuthMiddleware, upload.single('image'), addAuthor);

export default router;