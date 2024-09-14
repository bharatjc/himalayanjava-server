const express = require("express");
const router = express.Router();
const { saveProduct, fetchProduct } = require("../controller/product");

router.post("/product", saveProduct);
router.get("/product", fetchProduct);

module.exports = router;
