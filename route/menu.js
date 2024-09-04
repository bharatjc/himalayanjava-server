const express = require("express");
const router = express.Router();
const { saveMenu, fetchMenu } = require("../controller/menu");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/menu", checkAuthentication, saveMenu);
router.get("/menu", checkAuthentication, fetchMenu);

module.exports = router;
