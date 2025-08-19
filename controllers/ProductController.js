const Product = require("../models/Product");

class ProductController {
  static home = async (req, res) => {
    try {
      let query = { isDeleted: false };
      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ];
      }
      const products = await Product.find(query);
      res.render("customer/index", { products });
    } catch (err) {
      console.log(err);
      res.send("Something went wrong");
    }
  };

  static productDetail = async (req, res) => {
    try {
      const product = await Product.findOne({
        $or: [{ _id: req.params.id }, { slug: req.params.slug }],
        isDeleted: false,
      });

      if (!product) {
        return res.send("Product not found");
      }

      res.render("customer/productDetail", { product });
    } catch (err) {
      console.log(err);
      res.send("Something went wrong");
    }
  };
}

module.exports = ProductController;
