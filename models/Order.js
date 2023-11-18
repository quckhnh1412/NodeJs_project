const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  totalAmount: { type: Number, required: true },
  products: [orderItemSchema],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
