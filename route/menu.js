const express = require("express");
const router = express.Router();
const { saveMenu, fetchMenu, deleteMenu } = require("../controller/menu");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/menu", checkAuthentication, saveMenu);
router.get("/menu", fetchMenu);
router.delete("/deletemenu/:menuId", deleteMenu);

module.exports = router;
