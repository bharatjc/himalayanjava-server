const Customer = require("../model/Customer");
const Joi = require("joi");
const path = require("path");

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

    let uploadFile = req.files?.image;
    let image = "";
    if (uploadFile) {
      let extension = path.extname(uploadFile.name);
      let fileName = path.parse(uploadFile.name).name;
      let rootpath = path.resolve();
      fileName = `${fileName}-${Date.now()}${extension}`;
      let finalPath = path.join(rootpath, "uploads", fileName);
      image = `/uploads/${fileName}`;
      uploadFile.mv(finalPath, (err) => {
        console.log({ err });
      });
    }

    let customer = await Customer.create({
      ...req.body,
      image: image,
    });
    return res.send(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchCustomer(req, res) {
  try {
    let customers = await Customer.find();
    const baseUrl = "https://himalayanjava-server.onrender.com";
    const result = customers.map((customer) => {
      const customerObject = customer.toObject();
      return {
        ...customeruObject,
        image: `${baseUrl}${customerObject.image}`,
      };
    });
    res.send(result);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveCustomer, fetchCustomer };
