import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddlewares.js';
import { addAddress, deleteAddress, getUserAddresses, updateUserAddress } from '../../controllers/userAddressController.js';


const router = express.Router();

router.get("/", authMiddleware , getUserAddresses)
router.post("/", authMiddleware , addAddress)
router.put("/:id", authMiddleware , updateUserAddress)
router.delete("/:id", authMiddleware , deleteAddress)

export default router;