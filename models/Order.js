const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  give: {
    type: Number,
    required: true,
  },
  payback: {
    type: Number,
    required: true,
  },
  totalBill: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
