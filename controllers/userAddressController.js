import User from '../model/userModel.js'; 

// Controller to add a new address to a user
export const addAddress = async (req, res) => {
    try {
        const userId = req.user; 
        const {
            firstName,
            lastName,
            address1,
            address2,
            pinCode,
            phoneNumber,
            district,
            state,
            country,
        } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create the new address object
        const newAddress = {
            firstName,
            lastName,
            address1,
            address2,
            pinCode,
            phoneNumber,
            district,
            state,
            country,
        };

        // Add the new address to the user's address list
        user.address.push(newAddress);

        // Save the updated user document
        await user.save();

        return res.status(200).json({
            message: 'Address added successfully',
            address: newAddress,
        });
    } catch (error) {
        console.error('Error adding address:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user; 
        
        // Find the user by ID and retrieve the address field only
        const user = await User.findById(userId).select('address');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return the addresses if found
        return res.status(200).json({
            message: 'Addresses retrieved successfully',
            addresses: user.address,
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserAddress = async (req, res) => {
    const userId = req.user; 
    const addressId = req.params.id
    const addressData = req.body; // Extracting addressId and new address data from request body
    
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the address to update
        const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);

        // Check if the address exists
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update the address fields
        user.address[addressIndex] = {
            ...user.address[addressIndex], // Keep existing fields
            ...addressData // Update with new data
        };

        // Save the updated user document
        await user.save();

        // Return a success response with the updated address
        res.status(200).json({
            message: 'Address updated successfully',
            address: user.address[addressIndex]
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAddress = async (req, res) => {
    const userId = req.user
    const addressId = req.params.id;

    try {
        // Find the user and update their address array
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter out the address to be deleted
        user.address = user.address.filter(address => address._id.toString() !== addressId);

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};