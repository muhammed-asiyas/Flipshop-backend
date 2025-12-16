const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: { type: String, required: false },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  priceSnapshot: { type: Number, required: false },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // support guest carts via sessionId
    sessionId: { type: String, required: false, index: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);