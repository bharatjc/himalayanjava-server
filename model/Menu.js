const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const menuSchema = new Schema(
  {
    menuName: String,
    menuPrice: Number,
    image: String,
    user: ObjectId,
  },
  {
    timestamps: true,
  }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
