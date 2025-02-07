import User from '../model/userModel.js'

export const addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;
    if (!bookId) return res.status(404).json({ message : "bookId not found" })

    const userId = req.user;
    if (!userId) return res.status(200).json({ message:"user is required" })

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


export const getCart = async (req, res) => {
    const userId = req.user;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(userId).populate({
            path: 'cart.bookId',
            select: ' title primaryImageUrl originalPrice discount',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Combine book details with quantity
        const cartItems = user.cart.map((item) => ({
            bookId: item.bookId._id,
            title: item.bookId.title,
            primaryImageUrl: item.bookId.primaryImageUrl,
            originalPrice: item.bookId.originalPrice,
            discount: item.bookId.discount,
            quantity: item.quantity,
            cartId: item._id
        }));

        // Return the cart items
        return res.status(200).json({ cartItems });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCart = async (req, res) => {
    const userId = req.user;
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      const { cartId } = req.body;
  
      if (!cartId) {
        return res.status(400).json({ message: "Cart ID is required" });
      }
  
      // Find the user and remove the cart item with the given cartId
      const result = await User.updateOne(
        { _id: userId },
        { $pull: { cart: { _id: cartId } } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Cart item not found" });
      }
  
      return res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
  export const updateQuantity = async (req, res) => {
    const userId = req.user;

    if (!userId) {
        return res.status(200).json({ message: "User ID is required" });
    }

    try {
        const { cartId, quantity } = req.body;

        if (!cartId || quantity === undefined) {
            return res.status(200).json({ message: "Cart ID and quantity are required" });
        }

        if (quantity > 5) {
            return res.status(200).json({ message: "Maximum 5 quantity allowed at a time for the same item" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: "User not found" });
        }

        const cartItem = user.cart.find((item) => item._id.toString() === cartId);
        if (!cartItem) {
            return res.status(200).json({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;

        await user.save();

        return res.status(200).json({ message: "Cart item quantity updated successfully", cart: user.cart });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};
