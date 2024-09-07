const Outlet = require("../model/Outlet");
const Joi = require("joi");
const cloudinary = require("../config/cloudinary");

async function saveOutlet(req, res) {
  try {
    const OutletSchema = Joi.object({
      location: Joi.string().required().max(30),
      special: Joi.string(),
    });
    let status = OutletSchema.validate(req.body, {
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

    const existingOutlet = await Outlet.findOne({
      location: req.body.location,
    });
    if (existingOutlet) {
      return res.status(400).send({
        msg: "This location has been already registered.",
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

    let outlet = await Outlet.create({
      ...req.body,
      user: req.user._id,
      image: imageUrl,
    });
    return res.send(outlet);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchOutlet(req, res) {
  try {
    let outlets = await Outlet.find();
    res.send(outlets);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveOutlet, fetchOutlet };
