const Outlet = require("../model/Outlet");
const Joi = require("joi");
const path = require("path");

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

    let outlet = await Outlet.create({
      ...req.body,
      user: req.user._id,
      image: image,
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
    const baseUrl = "https://himalayanjava-server.onrender.com";
    const result = outlets.map((outlet) => {
      const outletObject = outlet.toObject();
      return {
        ...outletObject,
        image: `${baseUrl}${outletObject.image}`,
      };
    });
    res.send(result);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveOutlet, fetchOutlet };
