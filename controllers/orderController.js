// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendOrderEmail = require("../utils/sendMailer");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

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

        const price = product.price;
        itemsPrice += price * i.qty;

        return {
          product: i.product,
          qty: i.qty,
          price,
          name: product.name,
        };
      })
    );

    const shippingPrice = 60;
    const totalPrice = itemsPrice + shippingPrice;

    // Create order
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

    // Email sending (non-blocking)
    sendOrderEmail(shippingAddress.email, order).catch((err) =>
      console.error("Email failed:", err)
    );

    res.status(201).json(order);
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
