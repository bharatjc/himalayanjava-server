const express = require("express");
const router = express.Router();
const { saveOrder, fetchOrder } = require("../controller/order");

router.post("/order", saveOrder);
router.get("/order", fetchOrder);

module.exports = router;
