const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const CategoryController = require("../controllers/CategoryController");
const upload = require("../middlewares/upload");

router.get("/", AdminController.dashboard);
router.get("/products", AdminController.listProducts);
router.get("/products/add", AdminController.addProductForm);
router.post(
  "/products/add",
  upload.single("image"),
  AdminController.addProduct
);
router.get("/products/edit/:id", AdminController.editProductForm);
router.post(
  "/products/edit/:id",
  upload.single("image"),
  AdminController.updateProduct
);
router.get("/products/delete/:id", AdminController.deleteProduct);

// Categories
router.get("/categories", CategoryController.listCategories);
router.get("/categories/add", CategoryController.addCategoryForm);
router.post("/categories/add", CategoryController.addCategory);
router.get("/categories/edit/:id", CategoryController.editCategoryForm);
router.post("/categories/edit/:id", CategoryController.updateCategory);
router.get("/categories/delete/:id", CategoryController.deleteCategory);

module.exports = router;
