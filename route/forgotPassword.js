const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
} = require("../controller/forgotPassword");

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:id/:token", resetPassword);

module.exports = router;
