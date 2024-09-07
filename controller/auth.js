const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();
const cloudinary = require("../config/cloudinary");

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

    let updateFields = {
      businessname,
      image: imageUrl,
      username,
      email,
      password,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }

    const responseUser = {
      ...updatedUser.toObject(),
      image: updatedUser.image,
    };

    res.status(200).send({ msg: "Profile updated successfully", responseUser });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Server error" });
  }
}

module.exports = {
  signup: signup,
  login: login,
  updateProfile: updateProfile,
};
