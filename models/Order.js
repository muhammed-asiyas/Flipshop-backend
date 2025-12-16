const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        qty: { type: Number, default: 1 },
        price: Number,
        size: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      address: String,
      email: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: { type: String, default: "mock" },
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);