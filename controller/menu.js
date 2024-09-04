const Menu = require("../model/Menu");
const Joi = require("joi");
const path = require("path");

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

    let menu = await Menu.create({
      ...req.body,
      user: req.user._id,
      image: image,
    });
    return res.send(menu);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function fetchMenu(req, res) {
  try {
    let menus = await Menu.find();
    const baseUrl = "https://himalayanjava-server.onrender.com";
    const result = menus.map((menu) => {
      const menuObject = menu.toObject();
      return {
        ...menuObject,
        image: `${baseUrl}${menuObject.image}`,
      };
    });
    res.send(result);
  } catch (err) {
    res.status(500).send("Server Error");
  }
}

module.exports = { saveMenu, fetchMenu };
