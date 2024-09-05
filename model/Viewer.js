const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const viewerSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  subject: String,
  message: String,
});

const Viewer = mongoose.model("Viewer", viewerSchema);

module.exports = Viewer;
