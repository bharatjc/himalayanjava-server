const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const incomeSchema = new Schema(
  {
    sales: Number,
    expenses: Number,
    profit: Number,
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
