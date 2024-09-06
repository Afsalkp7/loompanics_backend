import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../model/adminModel.js';
import { sendVerificationEmail } from '../utils/mailOptions.js';

// import { sendVerificationEmail } from '../utils/sendOtp.js'
dotenv.config();

// Login 
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const admin = await Admin.findOne({ email: email });
  
      // Check if the user exists
      if (!admin) {
        return res.status(400).json({ msg: 'Invalid email' });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Respond with the token and user information
      res.json({
        msg: 'Login successful!',
        token,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  }

  // Forgot Password
export const adminForgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);
  
    try {
      // Find the user by email
      const user = await Admin.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Admin not found' });
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
  
      // Update user with new OTP and expiration
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
  
      // Send OTP via email
      await sendVerificationEmail(email, otp);
  
      // Respond with success message
      res.json({
        msg: 'OTP has been sent to your email. Please check your inbox to proceed with resetting your password.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  };

  export const adminChangePassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
  
    // Validate request data
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, msg: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, msg: 'Passwords do not match' });
    }
  
    try {
      // Find the user by email
      const user = await Admin.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, msg: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update user's password
      user.password = hashedPassword;
      await user.save();
  
      // Send success response
      res.status(200).json({ success: true, msg: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ success: false, msg: 'An error occurred while updating the password' });
    }
  };

  // Verify OTP
export const adminVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Find the user by email
      const user = await Admin.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
  
      // Check if OTP matches and is not expired
      if (user.otp != otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: 'Invalid or expired OTP' });
      }
      user.otp = undefined; // Clear the OTP
      user.otpExpires = undefined; // Clear OTP expiration time
      await user.save();
  
      // Generate JWT token after successful verification
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      return res.json({ msg: 'OTP verified successfully', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  