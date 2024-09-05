const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: String,
  email: String,
  profession: String,
  rating: Number,
  comment: String,
  image: String,
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
