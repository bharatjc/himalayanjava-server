const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

function forgotPassword(req, res) {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(404).send({ status: "User does not exist!" });
    }
    const JWT_SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    var mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Reset your password",
      text: `https://himalayanjava-admin.vercel.app/resetpassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        return res.status(500).send({ status: "Failed to send email" });
      } else {
        return res.status(200).send({ status: "Success", info });
      }
    });
  });
}

function resetPassword(req, res) {
  const { id, token } = req.params;
  const { password } = req.body;

  const JWT_SECRET_KEY = process.env.SECRET_KEY;
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send({ status: "Token error" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
}

module.exports = {
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
};
