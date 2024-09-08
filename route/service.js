const express = require("express");
const router = express.Router();
const { saveService, fetchService } = require("../controller/service");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/service", checkAuthentication, saveService);
router.get("/service", fetchService);

module.exports = router;
