const Category = require("../models/Category");

class CategoryController {
  static listCategories = async (req, res) => {
    try {
      const categories = await Category.find({ isDeleted: false });
      res.render("admin/categories", {
        categories,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (err) {
      req.flash("error_msg", "Error fetching categories");
      res.redirect("/admin");
    }
  };

  static addCategoryForm = (req, res) => {
    res.render("admin/addCategory", {
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    });
  };

  static addCategory = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        req.flash("error_msg", "Name is required");
        return res.redirect("/admin/categories/add");
      }

      const category = new Category({ name });
      await category.save();

      req.flash("success_msg", "Category added successfully");
      res.redirect("/admin/categories");
    } catch (err) {
      console.log(err);
      req.flash("error_msg", "Error adding category");
      res.redirect("/admin/categories/add");
    }
  };

  static editCategoryForm = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        req.flash("error_msg", "Category not found");
        return res.redirect("/admin/categories");
      }
      res.render("admin/editCategory", { category });
    } catch (err) {
      req.flash("error_msg", "Error fetching category");
      res.redirect("/admin/categories");
    }
  };

  static updateCategory = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        req.flash("error_msg", "Category not found");
        return res.redirect("/admin/categories");
      }

      category.name = req.body.name;
      await category.save();

      req.flash("success_msg", "Category updated successfully");
      res.redirect("/admin/categories");
    } catch (err) {
      req.flash("error_msg", "Error updating category");
      res.redirect("/admin/categories");
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        req.flash("error_msg", "Category not found");
        return res.redirect("/admin/categories");
      }

      category.isDeleted = true;
      await category.save();

      req.flash("success_msg", "Category deleted successfully");
      res.redirect("/admin/categories");
    } catch (err) {
      req.flash("error_msg", "Error deleting category");
      res.redirect("/admin/categories");
    }
  };
}

module.exports = CategoryController;
