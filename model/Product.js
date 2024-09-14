const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    customer: String,
    email: String,
    cardNo: String,
    product: {
      name: String,
      price: Number,
      quantity: Number,
      total: Number,
    },
    province: String,
    city: String,
    total: Number,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
