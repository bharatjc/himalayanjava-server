const Order = require("../model/Order");
const Joi = require("joi");

async function saveOrder(req, res) {
  try {
    const OrderSchema = Joi.object({
      customer: Joi.string().required().max(30),
      email: Joi.string().required(),
      cardNo: Joi.string().required().max(16),
      province: Joi.string().required(),
      city: Joi.string().required(),
      total: Joi.number().required().integer(),
      products: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            total: Joi.number().required(),
          })
        )
        .required(),
    });
    let status = OrderSchema.validate(req.body, {
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

    let order = await Order.create({
      ...req.body,
    });
    return res.send({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchOrder(req, res) {
  try {
    const total = await Order.countDocuments({});
    let result = await Order.find({}).sort({ createdAt: -1 });
    res.send({ orders: result, total: total });
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

async function updateStatus(req, res) {
  try {
    const { cId } = req.params;
    const { status } = req.body;

    const updatedStatus = {
      ...req.body,
      status,
    };
    const updatedOrder = await Order.findByIdAndUpdate(cId, updatedStatus, {
      new: true,
    });
    res.status(200).send({ msg: "Status updated successfully", updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
}

module.exports = { saveOrder, fetchOrder, updateStatus };
