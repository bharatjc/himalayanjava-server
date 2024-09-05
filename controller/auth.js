const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();
const path = require("path");

async function signup(req, res) {
  try {
    const signUpSchema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    });
    let status = signUpSchema.validate(req.body, {
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
    let { username, email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "Bad request",
        errors: [
          {
            msg: "Email already used",
            field: "email",
          },
        ],
      });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    return res.send(user);
  } catch (err) {
    return res.status(500).send(`Error: ${err.message}`);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    user = user.toObject();
    let validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      delete user.password;
      const JWT_SECRET_KEY = process.env.SECRET_KEY;
      let token = jwt.sign(user, JWT_SECRET_KEY);
      user.token = token;
      res.send({ data: user });
      return;
    }
  }
  res.status(401).send({ msg: "Invalid credentials!!" });
}

async function updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const { businessname, username, email, password } = req.body;

    let imagePath = "";
    if (req.files?.image) {
      const uploadFile = req.files.image;
      const extension = path.extname(uploadFile.name);
      const fileName = path.parse(uploadFile.name).name;
      const rootpath = path.resolve();
      const newFileName = `${fileName}-${Date.now()}${extension}`;
      const finalPath = path.join(rootpath, "uploads", newFileName);
      imagePath = `/uploads/${newFileName}`;

      uploadFile.mv(finalPath, (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(500).json({ msg: "Error uploading image" });
        }
      });
    }

    const updateFields = {
      businessname,
      image: imagePath,
      username,
      email,
      password,
    };

    // for (let key in updateFields) {
    //   if (updateFields[key] === undefined) {
    //     delete updateFields[key];
    //   }
    // }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields);

    res.status(200).send({ msg: "Profile updated successfully", updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
}

async function fetchUser(req, res) {
  try {
    let { userId } = req.params;
    let userdetails = await User.findOne({ _id: userId });
    if (userdetails) {
      res.send(userdetails);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.log({ Error: err });
    res.status(500).send({ msg: "Server error" });
  }
}

module.exports = {
  signup: signup,
  login: login,
  updateProfile: updateProfile,
  fetchUser: fetchUser,
};
