const Product = require("../models/Product");
const Category = require("../models/Category");

// Hiển thị danh sách sản phẩm
const loadProductsList = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    const categories = await Category.find();
    const message = req.flash("success")[0];
    if (req.session.user.role === "admin") {
      res.render("admin/products", {
        products: products,
        user: req.session.user,
        message: message,
      });
    } else {
      res.render("salesProducts", {
        products: products,
        user: req.session.user,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hiển thị trang tạo sản phẩm
const loadFromAddProduct = async (req, res) => {
  const categories = await Category.find();
  res.render("admin/addProduct", {
    categories: categories,
    user: req.session.user,
  });
};

// Xử lý tạo sản phẩm
const addProduct = async (req, res) => {
  try {
    const { barcode, productName, importPrice, retailPrice, category } =
      req.body;
    const categories = await Category.find();
    const product = new Product({
      barcode,
      productName,
      importPrice,
      retailPrice,
      category,
    });
    await product.save();
    res.render("admin/addProduct", {
      success: "Product added successfully",
      user: req.session.user,
      categories: categories,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hiển thị chi tiết sản phẩm
const loadProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (req.session.user.role === "admin") {
      res.render("admin/productDetails", {
        product: product,
        user: req.session.user,
      });
    } else {
      res.render("productDetails", {
        product: product,
        user: req.session.user,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hiển thị trang cập nhật sản phẩm
const editProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    const categories = await Category.find();
    res.render("admin/editProduct", {
      product: product,
      categories: categories,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Xử lý cập nhật sản phẩm
const editProduct = async (req, res) => {
  try {
    const { barcode, productName, importPrice, retailPrice, category } =
      req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      barcode,
      productName,
      importPrice,
      retailPrice,
      category,
    });
    res.redirect("/admin/products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const productDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.render("admin/productDetails", {
      product: product,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// Xử lý xoá sản phẩm
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "delete product successfully !");
    res.redirect("/admin/products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  loadProductsList,
  loadFromAddProduct,
  addProduct,
  editProductForm,
  editProduct,
  loadProductDetails,
  deleteProduct,
  productDetails,
};
