import User from '../model/userModel.js'

// Find all the users 
export const findUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find(); // You can add filters or projections if needed
    
        // Check if users were found
        if (!users || users.length === 0) {
          return res.status(404).json({ msg: 'No users found' });
        }
    
        // Send the list of users as a response
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ msg: 'Server error. Unable to fetch users.' });
      }
  }

// Controller function to find a single user by ID
export const findSingleUser = async (req, res) => {
    const { id } = req.params; // Extract the user ID from request parameters
    try {
      // Find the user by ID in the database
      const user = await User.findById(id);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with the user data if found
      res.status(200).json(user);
    } catch (error) {
      // Handle errors, such as invalid ID format or database connection issues
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Error finding user', error: error.message });
    }
  };

  export const updateStatus = async (req, res) => {
    const { id } = req.params; // Extract the user ID from the request parameters
    try {
      // Find the user by ID in the database
      const user = await User.findById(id);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Toggle the isBlocked status
      user.isBlocked = !user.isBlocked;
  
      // Save the updated user back to the database
      await user.save();
  
      // Respond with the updated user data
      res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } catch (error) {
      // Handle errors, such as invalid ID format or database connection issues
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Error updating user status', error: error.message });
    }
  };
  