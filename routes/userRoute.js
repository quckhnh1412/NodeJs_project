const express = require("express");
const exphbs = require("express-handlebars");
const userRoute = express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const flash = require("express-flash");
const { SESSION_SECRET } = process.env;

userRoute.use(flash());
userRoute.use(bodyParser.json());
userRoute.use(session({ secret: SESSION_SECRET }));
userRoute.use(bodyParser.urlencoded({ extended: true }));

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "handlebars",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }, // Specify the extension for handlebars files
  helpers: {
    multiply: function (a, b) {
      return a * b;
    },
    calculateTotalMoney: function (cart) {
      let total = 0;
      for (const item of cart) {
        total += item.quantity * item.product.retailPrice;
      }
      return total.toFixed(2); // Format the total to two decimal places
    },
    isEqual: function (str1, str2, options) {
      return str1 === str2 ? options.fn(this) : options.inverse(this);
    },
  },
});

userRoute.engine("handlebars", hbs.engine);
userRoute.set("view engine", "handlebars");

userRoute.use(express.static(__dirname + "/public"));

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

const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const auth = require("../middlewares/auth");

userRoute.get("/", auth.isLogout, userController.loadLogin);
userRoute.post("/", userController.login);
userRoute.get("/logout", auth.isLogin, userController.logout);
userRoute.get("/home", auth.isLogin, userController.loadSalesForm);
userRoute.get("/login", auth.isLogout, userController.loginWithToken);
userRoute.get("/profile", auth.isLogin, userController.loadProfile);
userRoute.post(
  "/update-profile",
  upload.single("image"),
  auth.isLogin,
  userController.updateProfile
);
userRoute.post("/add-customer", auth.isLogin, userController.addCustomer);
userRoute.get("/products", auth.isLogin, productController.loadProductsList);
userRoute.get(
  "/product-detail/:id",
  auth.isLogin,
  productController.loadProductDetails
);
userRoute.post("/check-customer", auth.isLogin, userController.checkCustomer);
userRoute.post("/search-product", auth.isLogin, userController.searchProduct);
userRoute.post("/add-to-cart", auth.isLogin, userController.addToCart);
userRoute.post(
  "/history-of-purchase",
  auth.isLogin,
  userController.loadHistoryOfPurchase
);
userRoute.post(
  "/delete-from-cart",
  auth.isLogin,
  userController.deleteFromCart
);
userRoute.post(
  "/search-product-barcode",
  auth.isLogin,
  userController.searchProductBarcode
);

//userRoute.get("/save-order", auth.isLogin, userController.saveOrder);

userRoute.get("/checkout", auth.isLogin, userController.loadCheckout);
//userRoute.get("/sale/add/:id", auth.isLogin, userController.addToOrder);
userRoute.post(
  "/sales-change-password",
  userController.changeSalesPasswordFirstLogin
);

module.exports = userRoute;
