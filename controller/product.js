const Product = require("../model/Product");
const Joi = require("joi");

async function saveProduct(req, res) {
  try {
    const ProductSchema = Joi.object({
      customer: Joi.string().required().max(30),
      email: Joi.string().required(),
      cardNo: Joi.string().required().max(16),
      total: Joi.number().required().integer(),
    });
    let status = ProductSchema.validate(req.body, {
      allowUnknown: true,
      abortEarly: false,
    });
    if (status.error) {
      let errors = status.error.details.map((detail) => {
        return {
          message: detail.message,
          field: detail.context.key,
        };
      });
      return res.status(400).send({
        msg: "Bad request",
        errors,
      });
    }

    let product = await Product.create({
      ...req.body,
    });
    return res.send({ product });
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchProduct(req, res) {
  try {
    const total = await Product.countDocuments({});
    let result = await Product.find({}).sort({ createdAt: -1 });
    res.send({ products: result, total: total });
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveProduct, fetchProduct };
