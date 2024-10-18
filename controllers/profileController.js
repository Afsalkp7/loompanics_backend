import User from '../model/userModel.js'
export const getUserProfile = async (req, res) => {
    try {
      // Extract user ID from req.user
      const userId = req.user;
  
      // Find the user by ID
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Send user profile as response
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  