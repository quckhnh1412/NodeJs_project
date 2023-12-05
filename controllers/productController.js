const Product = require('../models/Product'); 

const productController = {};

// Hiển thị danh sách sản phẩm
productController.list = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/list', { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hiển thị trang tạo sản phẩm
productController.createForm = (req, res) => {
  res.render('products/create');
};

// Xử lý tạo sản phẩm
productController.create = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, img, description });
    await product.save();
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hiển thị chi tiết sản phẩm
productController.detail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/detail', { product });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hiển thị trang cập nhật sản phẩm
productController.updateForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/update', { product });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Xử lý cập nhật sản phẩm
productController.update = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, img, description });
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Xử lý xoá sản phẩm
productController.delete = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = productController;
