const express = require("express");
const router = express.Router();
const {
  saveService,
  fetchService,
  deleteService,
} = require("../controller/service");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/service", checkAuthentication, saveService);
router.get("/service", fetchService);
router.delete("/deleteservice/:serviceId", deleteService);

module.exports = router;
