const express = require("express");
const router = express.Router();
const {
  saveViewer,
  fetchViewer,
  featureName,
} = require("../controller/viewer");

router.post("/viewer", saveViewer);
router.get("/viewer", fetchViewer);
router.post("/visitor", featureName);

module.exports = router;
