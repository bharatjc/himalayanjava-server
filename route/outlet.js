const express = require("express");
const router = express.Router();
const { saveOutlet, fetchOutlet } = require("../controller/outlet");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/outlet", checkAuthentication, saveOutlet);
router.get("/outlet", checkAuthentication, fetchOutlet);

module.exports = router;
