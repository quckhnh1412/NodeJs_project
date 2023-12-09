const express = require("express");
const exphbs = require("express-handlebars");
const adminRoute = express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const session = require("express-session");

const { SESSION_SECRET } = process.env;

adminRoute.use(bodyParser.json());
adminRoute.use(session({ secret: SESSION_SECRET }));
adminRoute.use(bodyParser.urlencoded({ extended: true }));

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "handlebars", // Specify the extension for handlebars files
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    isEqual: function (str1, str2, options) {
      return str1 === str2 ? options.fn(this) : options.inverse(this);
    },
  },
});

adminRoute.engine("handlebars", hbs.engine);
adminRoute.set("view engine", "handlebars");

adminRoute.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/avatar"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const auth = require("../middlewares/auth");

adminRoute.get("/register", auth.checkAdminRole, adminController.loadRegister);
adminRoute.post("/register", upload.single("image"), adminController.register);

adminRoute.get("/logout", auth.checkAdminRole, adminController.logout);
adminRoute.get("/home", auth.checkAdminRole, adminController.loadHome);
adminRoute.get("/users", auth.checkAdminRole, adminController.loadUsers);
adminRoute.get("/profile", auth.checkAdminRole, adminController.loadProfile);
adminRoute.post(
  "/update-profile",
  upload.single("image"),
  auth.checkAdminRole,
  adminController.updateProfile
);
adminRoute.get(
  "/resend-verify/:userId",
  auth.checkAdminRole,
  adminController.registerVerify
);
adminRoute.get(
  "/categories/add",
  auth.checkAdminRole,
  categoryController.loadFromAddCategory
);
adminRoute.post(
  "/categories/add",
  auth.checkAdminRole,
  categoryController.addCategory
);
adminRoute.get(
  "/products",
  auth.checkAdminRole,
  productController.loadProductsList
);
adminRoute.get(
  "/products/add",
  auth.checkAdminRole,
  productController.loadFromAddProduct
);
adminRoute.post(
  "/products/add",
  auth.checkAdminRole,
  productController.addProduct
);
adminRoute.get(
  "/products/edit/:id",
  auth.checkAdminRole,
  productController.editProductForm
);
adminRoute.post(
  "/products/edit/:id",
  auth.checkAdminRole,
  productController.editProduct
);
adminRoute.get("*", function (req, res) {
  res.redirect("/admin/home");
});

module.exports = adminRoute;
