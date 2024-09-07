import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import { sendVerificationEmail } from '../utils/mailOptions.js';

dotenv.config();

// Register Route
export const register = async (req, res) => {
  const { firstName, email, phoneNumber, password, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    if (password != confirmPassword) return res.status(400).json({ msg: 'Confirm password does not match' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const newUser = await User.create({
      username: firstName,
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await sendVerificationEmail(email, otp);
    return res.json({
      email: email,
      openOtp: true,
      msg: 'Registration successful. Please verify your account using the OTP sent to your email.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Check if the user is blocked
    if (user.isBlocked) return res.status(403).json({ msg: 'User is blocked. Please contact support.' });

    // Check if OTP matches and is not expired
    if (user.otp != otp || user.otpExpires < Date.now()) {
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

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ msg: 'User is blocked. Please contact support.' });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email to login.' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Update the user's last login date
    user.dateLastLogged = Date.now();
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user information
    res.json({
      msg: 'Login successful!',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        dateLastLogged: user.dateLastLogged,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Check if the user is blocked
    if (user.isBlocked) return res.status(403).json({ msg: 'User is blocked. Please contact support.' });

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

// Change Password
export const changePassword = async (req, res) => {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Check if the user is blocked
    if (user.isBlocked) return res.status(403).json({ msg: 'User is blocked. Please contact support.' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    user.isVerified = true;
    await user.save();

    // Send success response
    res.status(200).json({ success: true, msg: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, msg: 'An error occurred while updating the password' });
  }
};
