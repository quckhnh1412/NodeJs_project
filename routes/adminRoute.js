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
  helpers: {},
});

adminRoute.engine("handlebars", hbs.engine);
adminRoute.set("view engine", "handlebars");

adminRoute.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
adminRoute.get("/register", auth.isLoginAdmin, adminController.loadRegister);
adminRoute.post("/register", upload.single("image"), adminController.register);

adminRoute.get("/", auth.isLogoutAdmin, adminController.loadLogin);
adminRoute.post("/", adminController.login);
adminRoute.get("/logout", auth.isLoginAdmin, adminController.logout);
adminRoute.get("/home", auth.isLoginAdmin, adminController.loadHome);
adminRoute.get("*", function (req, res) {
  res.redirect("/");
});

module.exports = adminRoute;
