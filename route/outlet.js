const express = require("express");
const router = express.Router();
const {
  saveOutlet,
  fetchOutlet,
  popularOutlets,
  deleteOutlet,
} = require("../controller/outlet");
const { checkAuthentication } = require("../middleware/checkAuthentication");

router.post("/outlet", checkAuthentication, saveOutlet);
router.get("/outlet", fetchOutlet);
router.get("/popularoutlet", popularOutlets);
router.delete("/deleteoutlet/:outletId", deleteOutlet);

module.exports = router;
