const Viewer = require("../model/Viewer");
const Joi = require("joi");

async function saveViewer(req, res) {
  try {
    const ViewerSchema = Joi.object({
      name: Joi.string().required().max(30),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/),
      subject: Joi.string().required(),
      message: Joi.string().required(),
    });
    let status = ViewerSchema.validate(req.body, {
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

    let viewer = await Viewer.create({
      ...req.body,
    });
    return res.send(viewer);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchViewer(req, res) {
  try {
    let viewers = await Viewer.find();
    res.send(viewers);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

async function featureName(req, res) {
  try {
    const VisitorSchema = Joi.object({
      visitor: Joi.string().required().max(15),
    });
    let status = VisitorSchema.validate(req.body, {
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
    let visitor = req.body.visitor;
    res.status(200).send({ visitor });
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveViewer, fetchViewer, featureName };
