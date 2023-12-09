const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// Salesperson accounts with expiration timestamps

const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD;

const salespersons = {};

// Sample administrator account
const updateProfile = async (req, res) => {
  try {
    // Check if email already exists in the database
    const existingUser = await User.findOne({
      username: req.session.user.username,
    });

    existingUser.imageUrl = req.file.filename;
    await existingUser.save();
    req.session.user = existingUser;
    res.redirect("/admin/profile");
  } catch (e) {
    console.log(e.message);
  }
};
const loadProfile = async (req, res) => {
  try {
    const existingUser = req.session.user;
    res.render("admin/profile", { user: existingUser });
  } catch (e) {
    console.log(e.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("admin/register");
  } catch (e) {
    console.log(e.message);
  }
};
const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.render("admin/register", {
        message: "Email already exists. Please use a different email.",
      });
    }

    // Generate a unique token
    const token = generateToken();

    // Set an expiration timestamp (1 minute from now)
    const expirationTime = Date.now() + 60 * 1000;

    fullName = req.body.name;
    gmailAddress = req.body.email;
    const username = gmailAddress.match(/^(.+)@/)[1];

    // Generate a login link with the token
    const loginLink = `http://localhost:3000/login?token=${token}`;

    // Send an email to the salesperson
    sendAccountCreationEmail(fullName, gmailAddress, loginLink);
    //const passwordH = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: fullName,
      email: gmailAddress,
      username: username,
      password: username,
      imageUrl: null,
      is_changed_password: false,
      token: token,
      expiration_time: expirationTime,
    });
    await newUser.save();
    res.render("admin/register", { message: "Successful!!" });
  } catch (e) {
    console.log(e.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("admin/login");
  } catch (e) {
    console.log(e.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin/");
  } catch (e) {
    console.log(e.message);
  }
};
const loadHome = async (req, res) => {
  try {
    //var users = await Admin.find({ _id: { $nin: [req.session.user._id] } });
    res.render("admin/index", { user: req.session.user });
  } catch (e) {
    console.log(e.message);
  }
};

function sendAccountCreationEmail(fullName, gmailAddress, loginLink) {
  // Configure nodemailer with your email service provider's details
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: emailPassword,
    },
  });

  // Define the email content using Handlebars template
  const emailContent = {
    from: email,
    to: gmailAddress,
    subject: "Account Created - Login Now",
    template: "accountCreated",
    html: `
    <h3>Your account has been created!</h3>
    <p>Login <a href="${loginLink}">here</a> and change your password to be able to use the system.</p>
  `,
  };

  // Send the email
  transporter.sendMail(emailContent, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Function to generate a unique token
function generateToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

const loadUsers = async (req, res) => {
  try {
    const userList = await User.find({ role: "salesperson" });
    res.render("admin/users", { users: userList, user: req.session.user });
  } catch (e) {
    console.log(e.message);
  }
};

const registerVerify = async (req, res) => {
  const userId = req.params.userId;

  // Generate a unique token
  const token = generateToken();

  // Set an expiration timestamp (1 minute from now)
  const expirationTime = Date.now() + 60 * 1000;
  // Generate a login link with the token
  const loginLink = `http://localhost:3000/login?token=${token}`;
  try {
    const existingUser = await User.findOne({ _id: userId });
    if (existingUser) {
      existingUser.expiration_time = expirationTime;
      existingUser.token = token;
      await existingUser.save();
      // Send an email to the salesperson
      sendAccountCreationEmail(
        existingUser.name,
        existingUser.email,
        loginLink
      );
    }
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  loadRegister,
  register,
  loadLogin,
  loadHome,
  logout,
  loadUsers,
  registerVerify,
  updateProfile,
  loadProfile,
};
