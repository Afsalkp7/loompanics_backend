import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../model/adminModel.js';

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
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
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