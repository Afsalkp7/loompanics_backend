import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import { sendVerificationEmail } from '../utils/sendOtp.js'
dotenv.config();

// Register Route
export const register = async (req, res) => {
    
  const { firstName,email,phoneNumber,password,confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    if (password != confirmPassword) return res.status(400).json({ msg: 'Confirm password is not match' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     // Generate OTP
     const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 2 minutes

     const newUser = await User.create({
        username: firstName,
        email,
        phoneNumber,
        password: hashedPassword,
        otp,
        otpExpires,
      });
      await sendVerificationEmail(email,  otp);
      return res.json({ email : email ,openOtp : true , msg: 'Registration successful. Please verify your account using the OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}



export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        // Check if OTP matches and is not expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        // Mark the user as verified
        user.isVerified = true;
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



// Login Route
export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email:email });
//     if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, user: { id: user._id, email: user.email } });


//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
}