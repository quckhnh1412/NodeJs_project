const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// Salesperson accounts with expiration timestamps
const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderDetails = require("../models/OrderDetails");
const Customer = require("../models/Customer");
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
    res.render("admin/register", { user: req.session.user });
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
    const numberOfOrders = await Order.countDocuments();
    const numberOfProducts = await Product.countDocuments();
    const latestOrders = await Order.find()
      .sort({ creationDate: -1 })
      .limit(3)
      .populate("customer");

    const orders = await Order.find({});

    // Calculate total amount received, number of orders, etc.
    let totalAmountReceived = 0;
    for (const order of orders) {
      totalAmountReceived += order.totalBill;
    }

    res.render("admin/index", {
      user: req.session.user,
      numberOfOrders,
      numberOfProducts,
      totalAmountReceived,
      latestOrders,
    });
  } catch (e) {
    console.log(e.message);
  }
};

async function sendAccountCreationEmail(fullName, gmailAddress, loginLink) {
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

  // // Send the email
  // transporter.sendMail(emailContent, (error, info) => {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

  try {
    const info = await transporter.sendMail(emailContent);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
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
    const message = req.flash("success")[0];
    res.render("admin/users", {
      users: userList,
      user: req.session.user,
      message: message,
    });
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
      const check = sendAccountCreationEmail(
        existingUser.name,
        existingUser.email,
        loginLink
      );
      if (check) {
        req.flash("success", "send verification email successfully");
        res.redirect("/admin/users");
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};
const loadFormChangePassword = (req, res) => {
  try {
    res.render("admin/changePassword", { user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const loadAnalytics = (req, res) => {
  try {
    res.render("admin/analytics", { user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const changePassword = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      username: req.session.user.username,
    });
    existingUser.password = req.body.password;
    await existingUser.save();
    res.redirect("/admin/logout");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAnalytics = async (req, res) => {
  try {
    // Get the current date
    const currentDate = req.body.date;

    // Find orders for today in your database
    const Orders = await Order.find({
      creationDate: {
        $gte: new Date(currentDate + "T00:00:00.000Z"),
        $lt: new Date(currentDate + "T23:59:59.999Z"),
      },
    })
      .populate("customer")
      .populate("createdBy");

    let totalAmountReceived = 0;
    let numberOfOrders = 0;
    let numberOfProducts = 0;

    Orders.forEach((order) => {
      totalAmountReceived += order.totalBill;
      numberOfOrders++;
      //numberOfProducts += order.products.length;
    });

    res.json({ Orders, totalAmountReceived, numberOfOrders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAnalyticsForLast7Days = async (req, res) => {
  try {
    // Calculate the start and end dates for the last 7 days
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 7);

    const orders = await Order.find({
      creationDate: {
        $gte: startDate,
        $lt: currentDate,
      },
    })
      .populate("customer")
      .populate("createdBy");

    // Calculate total amount received, number of orders, etc.
    let totalAmountReceived = 0;
    let numberOfOrders = orders.length;
    for (const order of orders) {
      totalAmountReceived += order.totalBill;
    }

    res.json({
      totalAmountReceived,
      numberOfOrders,
      Orders: orders,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAnalyticsCustomDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const orders = await Order.find({
      creationDate: {
        $gte: parsedStartDate,
        $lt: parsedEndDate,
      },
    })
      .populate("customer")
      .populate("createdBy");

    let totalAmountReceived = 0;
    let numberOfOrders = orders.length;
    for (const order of orders) {
      totalAmountReceived += order.totalBill;
    }

    res.json({
      totalAmountReceived,
      numberOfOrders,
      Orders: orders,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAnalyticsForMonth = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    // Parse the date strings to ensure they are valid dates

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const orders = await Order.find({
      creationDate: {
        $gte: parsedStartDate,
        $lt: parsedEndDate,
      },
    })
      .populate("customer")
      .populate("createdBy");

    // Calculate total amount received, number of orders, etc.
    let totalAmountReceived = 0;
    let numberOfOrders = orders.length;
    for (const order of orders) {
      totalAmountReceived += order.totalBill;
    }

    res.json({
      totalAmountReceived,
      numberOfOrders,
      Orders: orders,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
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
  loadFormChangePassword,
  changePassword,
  loadAnalytics,
  getAnalytics,
  getAnalyticsForMonth,
  getAnalyticsForLast7Days,
  getAnalyticsCustomDateRange,
};
