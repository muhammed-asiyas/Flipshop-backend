const Order = require('../models/Order');
const Product = require('../models/Product');

// NEW: Resend mailer
const sendOrderEmail = require("../utils/sendMailer");  // Resend version



exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      email
    } = req.body;

    // ====== FIX 1: VALIDATE ITEMS ======
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // ====== FIX 2: FETCH PRODUCT PRICES & CALCULATE TOTALS ======
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
          price: price,
          name: product.name
        };
      })
    );

    // Shipping price
    const shippingPrice = 60;

    const totalPrice = itemsPrice + shippingPrice;

    // ====== FIX 3: CREATE ORDER ======
    const order = await Order.create({
      items: formattedItems,
      shippingAddress,
      paymentMethod,
      email,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      user: req.user?._id || null,
    });

    await order.populate("items.product");

    // ====== FIX 4: PREPARE ORDER FOR EMAIL ======
    const emailOrder = {
      ...order.toObject(),
      items: formattedItems.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
      }))
    };

    // ====== FIX 5: SEND EMAIL (RESEND) ======
    try {
      await sendOrderEmail(email, emailOrder);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Do NOT stop order creation if email fails
    }

    // ====== FIX 6: RESPOND TO FRONTEND ======
    res.status(201).json(order);

  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};



exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      order.user && 
      req.user && 
      order.user._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
