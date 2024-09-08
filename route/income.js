const express = require("express");
const router = express.Router();
const { saveIncome, fetchIncome } = require("../controller/income");

router.post("/income", saveIncome);
router.get("/income", fetchIncome);

module.exports = router;
