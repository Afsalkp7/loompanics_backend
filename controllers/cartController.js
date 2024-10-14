import User from '../model/userModel.js'

export const addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;
    const userId = req.user;  

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the item is already in the cart
        const existingCartItem = user.cart.find(
            (item) => item.bookId.toString() === bookId
        );

        if (existingCartItem) {
            // Update the quantity if the item exists
            existingCartItem.quantity += quantity;
        } else {
            // Add new item to the cart
            user.cart.push({ bookId, quantity });
        }

        // Save the user with the updated cart
        await user.save();

        return res.status(200).json({ cartItems: user.cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
