const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const serviceSchema = new Schema({
  title: String,
  description: String,
  image: String,
  user: ObjectId,
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
