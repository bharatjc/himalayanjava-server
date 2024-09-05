const express = require("express");
const router = express.Router();
const { saveCustomer, fetchCustomer } = require("../controller/customer");

router.post("/customer", saveCustomer);
router.get("/customer", fetchCustomer);

module.exports = router;
