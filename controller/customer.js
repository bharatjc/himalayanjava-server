const Customer = require("../model/Customer");
const Joi = require("joi");
const cloudinary = require("../config/cloudinary");

async function saveCustomer(req, res) {
  try {
    const CustomerSchema = Joi.object({
      name: Joi.string().required().max(30),
      email: Joi.string().email().required(),
      profession: Joi.string().required().max(30),
      rating: Joi.number().required(),
      comment: Joi.string().required(),
    });
    let status = CustomerSchema.validate(req.body, {
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

    const existingCustomer = await Customer.findOne({
      name: req.body.name,
    });
    if (existingCustomer) {
      return res.status(400).send({
        msg: "This customer already exists.",
      });
    }

    let imageUrl = "";
    if (req.files?.image) {
      const uploadFile = req.files.image;
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              reject("Image upload failed");
            } else {
              resolve(result.secure_url);
            }
          }
        );
        stream.end(uploadFile.data);
      });
    }

    let customer = await Customer.create({
      ...req.body,
      image: imageUrl,
    });
    return res.send(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchCustomer(req, res) {
  try {
    let result = await Customer.find();
    res.send(result);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

async function fetchLatestCustomers(req, res) {
  try {
    const total = await Customer.countDocuments({});
    const latestCustomers = await Customer.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    res.send({
      customers: latestCustomers,
      total: total,
    });
  } catch (error) {
    console.error("Error fetching latest users:", error);
  }
}

module.exports = { saveCustomer, fetchCustomer, fetchLatestCustomers };
