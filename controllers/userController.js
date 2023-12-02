const User = require("../models/User");
const bcrypt = require("bcrypt");
const loadRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (e) {
    console.log(e.message);
  }
};
const register = async (req, res) => {
  try {
    // Check if email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If email already exists, render the register page with an error message
      return res.render("register", {
        message: "Email already exists. Please use a different email.",
      });
    }
    const passwordH = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      imageUrl: "images/" + req.file.filename,
      password: passwordH,
    });
    await newUser.save();
    res.render("register", { message: "Successful!!" });
  } catch (e) {
    console.log(e.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (e) {
    console.log(e.message);
  }
};
const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = user;
        res.redirect("/home");
      } else {
        res.render("login", { message: "password invalid" });
      }
    } else {
      res.render("login", { message: "email and password invalid" });
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
    var users = await User.find({ _id: { $nin: [req.session.user._id] } });
    res.render("index", { user: req.session.user, users: users });
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  loadRegister,
  register,
  loadLogin,
  login,
  loadHome,
  logout,
};
