const Product = require("../models/Product");
const Category = require("../models/Category");
const { productValidation } = require("../middlewares/validation");
const fs = require("fs");
const path = require("path");

const categories = ["Electronics", "Books", "Clothing", "Toys"];

class AdminController {
  // static dashboard = async (req, res) => {
  //   try {
  //     const totalProducts = await Product.countDocuments({ isDeleted: false });
  //     res.render("admin/dashboard", { totalProducts });
  //   } catch (error) {
  //     req.flash("error_msg", "Something went wrong");
  //     res.redirect("/admin");
  //   }
  // };
  static dashboard = async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments({ isDeleted: false });
      const totalCategories = await Category.countDocuments({
        isDeleted: false,
      });

      res.render("admin/dashboard", {
        totalProducts,
        totalCategories,
      });
    } catch (error) {
      req.flash("error_msg", "Something went wrong");
      res.redirect("/admin");
    }
  };

  static listProducts = async (req, res) => {
    try {
      const products = await Product.find({ isDeleted: false });
      res.render("admin/products", { products });
    } catch (error) {
      req.flash("error_msg", "Cannot fetch products");
      res.redirect("/admin");
    }
  };

  // static addProductForm = (req, res) => {
  //   res.render("admin/addProduct", {
  //     categories,
  //     success_msg: req.flash("success_msg"),
  //     error_msg: req.flash("error_msg"),
  //   });
  // };

  static addProductForm = async (req, res) => {
    try {
      const categories = await Category.find({ isDeleted: false });
      res.render("admin/addProduct", {
        categories,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (err) {
      req.flash("error_msg", "Cannot load categories");
      res.redirect("/admin/products");
    }
  };

  static addProduct = async (req, res) => {
    try {
      const { error } = productValidation(req.body);
      if (error) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        req.flash("error_msg", error.details[0].message);
        return res.redirect("/admin/products/add");
      }

      const product = new Product({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        image: req.file ? req.file.filename : "",
      });

      await product.save();
      req.flash("success_msg", "Product added successfully");
      res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      req.flash("error_msg", "Error adding product");
      res.redirect("/admin/products/add");
    }
  };

  static editProductForm = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        req.flash("error_msg", "Product not found");
        return res.redirect("/admin/products");
      }
      // res.render("admin/editProduct", {
      //   product,
      //   categories,
      //   success_msg: req.flash("success_msg"),
      //   error_msg: req.flash("error_msg"),
      // });

      const categories = await Category.find({ isDeleted: false });
      res.render("admin/editProduct", {
        product,
        categories,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (err) {
      req.flash("error_msg", "Something went wrong");
      res.redirect("/admin/products");
    }
  };

  static updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        req.flash("error_msg", "Product not found");
        return res.redirect("/admin/products");
      }

      const { error } = productValidation(req.body);
      if (error) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        req.flash("error_msg", error.details[0].message);
        return res.redirect(`/admin/products/edit/${req.params.id}`);
      }

      if (req.file && product.image) {
        fs.unlinkSync(path.join("uploads", product.image));
      }

      product.name = req.body.name;
      product.category = req.body.category;
      product.description = req.body.description;
      if (req.file) product.image = req.file.filename;

      await product.save();
      req.flash("success_msg", "Product updated successfully");
      res.redirect("/admin/products");
    } catch (err) {
      console.log(err);
      req.flash("error_msg", "Error updating product");
      res.redirect("/admin/products");
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        req.flash("error_msg", "Product not found");
        return res.redirect("/admin/products");
      }

      if (product.image) {
        fs.unlinkSync(path.join("uploads", product.image));
      }

      product.isDeleted = true;
      await product.save();
      req.flash("success_msg", "Product deleted successfully");
      res.redirect("/admin/products");
    } catch (err) {
      req.flash("error_msg", "Error deleting product");
      res.redirect("/admin/products");
    }
  };
}

module.exports = AdminController;
