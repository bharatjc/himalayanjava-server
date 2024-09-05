const express = require("express");
const router = express.Router();
const { saveViewer, fetchViewer } = require("../controller/viewer");

router.post("/viewer", saveViewer);
router.get("/viewer", fetchViewer);

module.exports = router;
