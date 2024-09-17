const express = require("express");
const router = express.Router();
const {
  saveOrder,
  fetchOrder,
  updateStatus,
  getPurchaseHistory,
} = require("../controller/order");

router.post("/order", saveOrder);
router.get("/order", fetchOrder);
router.put("/order/:cId", updateStatus);
router.get("/history/:cardNo", getPurchaseHistory);

module.exports = router;
