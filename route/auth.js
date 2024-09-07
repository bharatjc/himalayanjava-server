const express = require("express");
const router = express.Router();
const { signup, login, updateProfile } = require("../controller/auth");

router.post("/signup", signup);
router.post("/login", login);
router.put("/update/:userId", updateProfile);

module.exports = router;
