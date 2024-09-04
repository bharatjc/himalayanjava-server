const express = require("express");
const router = express.Router();
const { saveService } = require("../controller/service");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/service", checkAuthentication, saveService);

module.exports = router;
