const User = require("../models/User");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// Salesperson accounts with expiration timestamps
const salespersons = {};

// Sample administrator account
let adminCredentials = {
  username: "admin",
  password: "admin",
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
      return res.render("register", {
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

const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      //const passwordMatch = await bcrypt.compare(password, admin.password);

      req.session.user = "admin";
      res.redirect("/admin/home");

      res.render("admin/login", { message: "password invalid" });
    } else {
      res.render("admin/login", { message: "email and password invalid" });
    }
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
    res.render("index", { user: req.session.user });
  } catch (e) {
    console.log(e.message);
  }
};

function sendAccountCreationEmail(fullName, gmailAddress, loginLink) {
  // Configure nodemailer with your email service provider's details
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "quckhnh1412@gmail.com",
      pass: "wjlg prev slsn xqka",
    },
  });

  // Define the email content using Handlebars template
  const emailContent = {
    from: "quckhnh1412@gmail.com",
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

module.exports = {
  loadRegister,
  register,
  loadLogin,
  login,
  loadHome,
  logout,
};
