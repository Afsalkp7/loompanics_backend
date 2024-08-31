import express from 'express';
import { adminLogin } from '../controllers/adminAuthCotroller.js';
const router = express.Router();


// Login Route
router.post('/login', adminLogin);

// // Verify OTP
// router.post('/verify-otp', adminVerifyOtp);

// // Forgot password
// router.post('/forgot',adminForgotPassword)

// // password update
// router.put("/password",AdminChangePassword)


export default router;