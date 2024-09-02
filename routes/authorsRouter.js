import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import upload from '../middlewares/multerConfig.js';
import { addAuthor, authorUpdateStatus, deleteAuthor, findAuthors, findSingleAuthor } from '../controllers/authorController.js';
const router = express.Router();

//  Get all authors
router.get("/",adminAuthMiddleware,findAuthors)

// Get single author
router.get("/:id",adminAuthMiddleware,findSingleAuthor)


// Update author details
router.put("/:id",adminAuthMiddleware,upload.single('image'),authorUpdateStatus)

// Delete author details
router.delete("/:id",adminAuthMiddleware,deleteAuthor)

// Add author

router.post('/', adminAuthMiddleware, upload.single('image'), addAuthor);

export default router;