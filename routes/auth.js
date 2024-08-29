import express from 'express';
import { login, register } from '../controllers/authController.js';
import { verifyOtp } from '../controllers/authController.js';
import { forgotPassword } from '../controllers/authController.js';
const router = express.Router();

// Register Route
router.post('/register', register);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Login Route
router.post('/login', login);

// Forgot password
router.post('/forgot',forgotPassword)

export default router;