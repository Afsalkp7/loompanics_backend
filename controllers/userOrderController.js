
import { Books } from "../model/booksModel.js";
import { Order } from "../model/orderModel.js";
import User from "../model/userModel.js";

export const placeOrder = async (req, res) => {
  const { productId, addressId } = req.body;

  if (!addressId) {
    return res.status(400).json({ message: "Address ID is required." });
  }

  try {
    const user = await User.findById(req.user).populate("cart.bookId");
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const address = user.address.find((addr) => addr._id.toString() === addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found in user data." });
    }

    let orderedProducts = [];
    let totalAmount = 0;
    let discount = 0;
    let deliveryCharge = 0;
    let amount = 0;

    if (productId) {

      const book = await Books.findById(productId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
      
      orderedProducts.push({
        bookId: productId,
        quantity: 1,
      });
      totalAmount = book.originalPrice;
      discount = book.discount;
      deliveryCharge = totalAmount-discount > 1000 ? 0 : totalAmount-discount > 500 ? 50 : 60;
      amount = totalAmount - discount + deliveryCharge
    } else {

      if (!user.cart || user.cart.length === 0) {
        return res
          .status(400)
          .json({ message: "Cart is empty. Add items to the cart first." });
      }

      orderedProducts = user.cart.map((item) => ({
        bookId: item.bookId._id,
        quantity: item.quantity,
      }));

      console.log(user.cart);
      
      // Calculate total amount from the cart
      totalAmount = user.cart.reduce(
        (sum, item) => sum + item.bookId.originalPrice * item.quantity,
        0
      );
      discount = user.cart.reduce(
        (sum, item) => sum + item.bookId.discount * item.quantity,
        0
      );
      deliveryCharge = totalAmount-discount > 1000 ? 0 : totalAmount-discount > 500 ? 50 : 60;
      amount = totalAmount - discount + deliveryCharge
    }

    // Prepare ordered items
    const orderedItems = {
      products: orderedProducts,
      addressId,
      totalAmount,
      discount,
      deliveryCharge,
      amount,
      status: "OrderPlaced",
      orderedDate: new Date(),
    };

    console.log(orderedItems);
    

    // Check if an order already exists for the user
    let order = await Order.findOne({ userId: req.user });
    if (order) {
      // Append to existing order
      order.orderedItems.push(orderedItems);
    } else {
      // Create a new order
      order = new Order({
        userId: req.user,
        orderedItems: [orderedItems],
      });
    }

    await order.save();

    // Clear user's cart if applicable
    if (!productId) {
      user.cart = [];
      await user.save();
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
