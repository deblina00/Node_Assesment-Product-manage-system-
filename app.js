const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/db");
require("dotenv").config();

const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");

const app = express();

// DB Connection
connectDB();

// Seed Categories
const Category = require("./models/Category");
const seedCategories = async () => {
  const categories = ["Electronics", "Books", "Clothing", "Toys"];
  for (let name of categories) {
    const exists = await Category.findOne({ name });
    if (!exists) await Category.create({ name });
  }
};
seedCategories();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));

// Session & Flash
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Global Flash Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/admin", adminRoutes);
app.use("/", customerRoutes);

// Start Server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
