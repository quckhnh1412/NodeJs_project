const Product = require("../models/Product");
const Category = require("../models/Category");

const loadFromAddCategory = (req, res) => {
  try {
    res.render("admin/addCategory");
  } catch (e) {
    console.log(e.message);
  }
};
const addCategory = async (req, res) => {
  const { categoryName } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.render("admin/addCategory", {
        error: "Category already exists",
        user: req.session.user,
      });
    }

    // Create a new category
    const newCategory = new Category({ categoryName });
    await newCategory.save();

    res.render("admin/addCategory", {
      success: "Category added successfully",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.render("admin/addCategory", { error: "Error adding category" });
  }
};
module.exports = { loadFromAddCategory, addCategory };
