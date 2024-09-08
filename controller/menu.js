const Menu = require("../model/Menu");
const Joi = require("joi");
const cloudinary = require("../config/cloudinary");

async function saveMenu(req, res) {
  try {
    const MenuSchema = Joi.object({
      menuName: Joi.string().required().max(30),
      menuPrice: Joi.number().required().integer().min(1),
    });
    let status = MenuSchema.validate(req.body, {
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

    const existingMenu = await Menu.findOne({ menuName: req.body.menuName });
    if (existingMenu) {
      return res.status(400).send({
        msg: "A menu with this name already exists.",
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

    let menu = await Menu.create({
      ...req.body,
      user: req.user._id,
      image: imageUrl,
    });
    return res.send(menu);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchMenu(req, res) {
  try {
    let result = await Menu.find({}).sort({ createdAt: -1 }).limit(20);
    res.send({ menus: result, limit: 20 });
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveMenu, fetchMenu };
