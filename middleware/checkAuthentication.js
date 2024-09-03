const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.SECRET_KEY;

function checkAuthentication(req, res, next) {
  try {
    let token = req.headers.authorization.replace("Bearer ", "");
    let decoded = jwt.verify(token, JWT_SECRET_KEY);
    let user = decoded;
    req.user = user;
    next();
  } catch (err) {
    console.log("Error", err);
    return res.status(400).send({
      msg: "unauthenticated",
    });
  }
}

module.exports = { checkAuthentication };
