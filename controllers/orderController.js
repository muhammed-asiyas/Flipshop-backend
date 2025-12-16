const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderEmail } = require("../utils/emailService");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Validate email
    if (!shippingAddress?.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Calculate totals
    let itemsPrice = 0;

    const formattedItems = await Promise.all(
      items.map(async (i) => {
        const product = await Product.findById(i.product);
        if (!product) throw new Error("Product not found");

        const qty = Number(i.qty ?? i.quantity ?? 1);
        const price = product.price;
        itemsPrice += price * qty;

        return {
          product: product._id,
          qty,
          price,
          name: product.name,
          size: i.size,
        };
      })
    );

    const shippingPrice = 60;
    const totalPrice = itemsPrice + shippingPrice;

    // Create the order in DB
    const order = await Order.create({
      items: formattedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      user: req.user?._id || null,
    });

    await order.populate("items.product");

    // Send email (SendGrid REST API)
    sendOrderEmail(shippingAddress.email, order)
      .then(() => console.log("Order email sent:", order._id))
      .catch((err) => console.error("Email sending failed:", err));

    res.status(201).json(order);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};