const User = require("../models/User");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// Salesperson accounts with expiration timestamps

const loadRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (e) {
    console.log(e.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("salesLogin");
  } catch (e) {
    console.log(e.message);
  }
};
const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await User.findOne({
      username: username,
    });
    if (existingUser) {
      if (!existingUser.is_changed_password) {
        console.log(existingUser.username);
        //const passwordMatch = await bcrypt.compare(password, admin.password);
        res.render("salesLogin", {
          message:
            "please change password first when click the link sent via email",
        });
      } else {
        req.session.user = existingUser;
        res.redirect("/home");
      }
    } else {
      res.render("salesLogin", { message: "email and password invalid" });
    }
  } catch (e) {
    console.log(e.message);
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (e) {
    console.log(e.message);
  }
};
const loadHome = async (req, res) => {
  try {
    //var users = await Admin.find({ _id: { $nin: [req.session.user._id] } });
    res.render("index", { user: req.session.user });
  } catch (e) {
    console.log(e.message);
  }
};

const loginWithToken = async (req, res) => {
  try {
    const existingUser = await User.findOne({ token: req.query.token });
    expiration_time = existingUser.expiration_time;
    // Check if the token exists and is not expired
    if (expiration_time > Date.now()) {
      req.session.user = existingUser;
      // Render the login page (you can customize this page using Handlebars)
      existingUser.token = null;
      existingUser.status = "Active";
      existingUser.expiration_time = null;
      existingUser.save();
      res.render("sales_change_password");
    } else {
      res
        .status(401)
        .send("Please login by clicking on the link in your email.");
    }
  } catch (e) {
    console.log(e.message);
  }
};

const changeSalesPasswordFirstLogin = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      username: req.session.user.username,
    });
    token = existingUser.token;
    // Check if the token exists and is not expired
    if (token == null) {
      existingUser.password = req.body.password;
      existingUser.is_changed_password = true;
      existingUser.save();
      res.render("index");
    } else {
      res
        .status(401)
        .send("Please login by clicking on the link in your email.");
    }
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  loadLogin,
  login,
  loadHome,
  logout,
  loginWithToken,
  changeSalesPasswordFirstLogin,
};
