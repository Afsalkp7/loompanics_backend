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