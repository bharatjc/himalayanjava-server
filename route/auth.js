const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  updateProfile,
  fetchUser,
} = require("../controller/auth");

router.post("/signup", signup);
router.post("/login", login);
router.put("/update/:userId", updateProfile);
router.get("/fetch/:userId", fetchUser);

module.exports = router;
