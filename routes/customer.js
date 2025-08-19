const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.get("/", ProductController.home);
router.get("/product/:slug", ProductController.productDetail);
router.get("/product/id/:id", ProductController.productDetail);

module.exports = router;
