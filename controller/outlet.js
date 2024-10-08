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
    let result = await Outlet.find().sort({ createdAt: -1 }).limit(20);
    res.send({ outlets: result, limit: 20 });
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

async function popularOutlets(req, res) {
  try {
    const popularOutlets = await Outlet.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("location special");
    res.send({ popularOutlets });
  } catch (error) {
    console.error("Error fetching latest users:", error);
  }
}

async function deleteOutlet(req, res) {
  try {
    const location = req.params.location;
    await Outlet.deleteOne({ location });
    return res.send("Outlet deleted successfully");
  } catch (err) {
    console.log("Error", err);
    return res.send(`Error: ${err.message}`);
  }
}

module.exports = { saveOutlet, fetchOutlet, popularOutlets, deleteOutlet };
