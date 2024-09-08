const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const outletSchema = new Schema(
  {
    location: String,
    special: String,
    image: String,
    user: ObjectId,
  },
  {
    timestamps: true,
  }
);

const Outlet = mongoose.model("Outlet", outletSchema);

module.exports = Outlet;
