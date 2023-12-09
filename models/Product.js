const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  importPrice: {
    type: Number,
    required: true,
  },
  retailPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
