const Service = require("../model/Service");
const Joi = require("joi");
const cloudinary = require("../config/cloudinary");

async function saveService(req, res) {
  try {
    const ServiceSchema = Joi.object({
      title: Joi.string().required().max(30),
      description: Joi.string().required(),
    });
    let status = ServiceSchema.validate(req.body, {
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

    const existingService = await Service.findOne({ title: req.body.title });
    if (existingService) {
      return res.status(400).send({
        msg: "A file with this title already exists.",
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

    let service = await Service.create({
      ...req.body,
      user: req.user._id,
      image: imageUrl,
    });
    return res.send(service);
  } catch (err) {
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchService(req, res) {
  try {
    let services = await Service.find();
    res.send(services);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveService, fetchService };
