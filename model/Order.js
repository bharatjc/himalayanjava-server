const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customer: String,
    email: String,
    cardNo: String,
    orders: [
      {
        products: [
          {
            name: String,
            price: Number,
            quantity: Number,
            total: Number,
          },
        ],
        province: String,
        city: String,
        total: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    status: String,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
