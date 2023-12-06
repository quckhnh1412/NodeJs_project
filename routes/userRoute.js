const express = require("express");
const exphbs = require("express-handlebars");
const userRoute = express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const session = require("express-session");

const { SESSION_SECRET } = process.env;

userRoute.use(bodyParser.json());
userRoute.use(session({ secret: SESSION_SECRET }));
userRoute.use(bodyParser.urlencoded({ extended: true }));

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "handlebars", // Specify the extension for handlebars files
  helpers: {},
});

userRoute.engine("handlebars", hbs.engine);
userRoute.set("view engine", "handlebars");

userRoute.use(express.static("public"));

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

const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

userRoute.get("/", auth.isLogout, userController.loadLogin);
userRoute.post("/", userController.login);
userRoute.get("/logout", auth.isLogin, userController.logout);
userRoute.get("/home", auth.isLogin, userController.loadHome);
userRoute.get("/login", userController.loginWithToken);
userRoute.post(
  "/sales-change-password",
  userController.changeSalesPasswordFirstLogin
);

module.exports = userRoute;
