const Service = require("../model/Service");
const Joi = require("joi");
const path = require("path");

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

    let service = await Service.create({
      ...req.body,
      user: req.user._id,
      image: image,
    });
    return res.send(service);
  } catch (err) {
    return res.status(500).send(`Error: ${err.message}`);
  }
}

module.exports = { saveService };
