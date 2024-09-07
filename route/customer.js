const express = require("express");
const router = express.Router();
const {
  saveCustomer,
  fetchCustomer,
  fetchLatestCustomers,
} = require("../controller/customer");

router.post("/customer", saveCustomer);
router.get("/customer", fetchCustomer);
router.get("/latestcustomers", fetchLatestCustomers);

module.exports = router;
