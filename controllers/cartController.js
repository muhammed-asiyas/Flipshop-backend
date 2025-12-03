

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.json({
        items: [],
        subtotal: 0,
        discount: 0,
        grandTotal: 0,
      });
    }

    let subtotal = 0;

    cart.items.forEach((item) => {
      const price = item.priceSnapshot || item.product.price;
      subtotal += price * item.quantity; // <-- FIXED HERE
    });

    const discount = cart.discount || 0;
    const grandTotal = subtotal - discount;

    res.json({
      items: cart.items,
      subtotal,
      discount,
      grandTotal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { productId, qty, size } = req.body;

    const quantity = Number(qty) || 1;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check if item is already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();
    await cart.populate("items.product");
    res.json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item quantity
exports.updateQty = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const userId = req.user ? req.user.id : null;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i._id.toString() === itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const userId = req.user ? req.user.id : null;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
