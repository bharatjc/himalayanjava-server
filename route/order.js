const express = require("express");
const router = express.Router();
const { saveOrder, fetchOrder, updateStatus } = require("../controller/order");

router.post("/order", saveOrder);
router.get("/order", fetchOrder);
router.put("/order/:cId", updateStatus);

module.exports = router;
