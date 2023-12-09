const User = require("../models/User");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderDetails = require("../models/OrderDetails");
const Cart = require("../models/Cart");
const { render } = require("../routes/userRoute");
// Salesperson accounts with expiration timestamps

const loadRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (e) {
    console.log(e.message);
  }
};
const updateProfile = async (req, res) => {
  try {
    // Check if email already exists in the database
    const existingUser = await User.findOne({
      username: req.session.user.username,
    });

    existingUser.imageUrl = req.file.filename;
    await existingUser.save();
    req.session.user = existingUser;
    res.redirect("/profile");
  } catch (e) {
    console.log(e.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    const message = req.flash("failure")[0];
    res.render("salesLogin", { isLoginPage: true, message: message });
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
      if (
        username === "admin" &&
        password === existingUser.password &&
        existingUser.role === "admin"
      ) {
        req.session.user = existingUser;
        res.redirect("admin/home");
      }
      if (!existingUser.is_changed_password) {
        console.log(existingUser.username);
        //const passwordMatch = await bcrypt.compare(password, admin.password);
        //res.render("salesLogin", {
        // message:
        //   "please change password first when click the link sent via email",
        // isLoginPage: true,
        //});
        req.flash(
          "failure",
          "please change password first when click the link sent via email"
        );
        res.redirect("/"); // Redirect to another page
      }
      if (password === existingUser.password) {
        req.session.user = existingUser;
        res.redirect("/home");
      } else {
        //res.render("salesLogin", {
        //  message: " password invalid",
        //  isLoginPage: true,
        //});
        req.flash("failure", "password invalid");
        res.redirect("/");
      }
    } else {
      // res.render("salesLogin", {
      //   message: "username invalid",
      //   isLoginPage: true,
      // });
      req.flash("failure", "username invalid");
      res.redirect("/");
    }
  } catch (e) {
    console.log(e.message);
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy();
    await Cart.deleteMany();
    res.redirect("/");
  } catch (e) {
    console.log(e.message);
  }
};
const loadCheckout = async (req, res) => {
  try {
    //var users = await Admin.find({ _id: { $nin: [req.session.user._id] } });
    const cart = await Cart.find().populate("product");
    res.render("salesHome", { user: req.session.user, cart: cart });
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
      // Render the login page (you can customize this page using Handlebars).0
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

const loadProfile = async (req, res) => {
  try {
    const existingUser = req.session.user;

    if (existingUser) {
      if (!existingUser.is_changed_password) {
        //const passwordMatch = await bcrypt.compare(password, admin.password);
        res.render("salesLogin", {
          message:
            "please change password first when click the link sent via email",
        });
      } else {
        res.render("salesProfile", { user: existingUser });
      }
    } else {
      res.render("salesLogin", { message: "email and password invalid" });
    }
  } catch (e) {
    console.log(e.message);
  }
};

const checkCustomer = async (req, res) => {
  const { phone } = req.body;

  try {
    let customer = await Customer.findOne({ phone });

    if (!customer) {
    }
    req.session.customer = customer;
    res.json({ customer });
    return; // Exit the function after sending the response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addCustomer = async (req, res) => {
  try {
    let phone = req.body.phone;
    let name = req.body.name;
    let address = req.body.address;
    if (req.session.customer != null) {
      saveOrder(req, res);
      //res.render("salesHome", {
      //  message: "Successful!!",
      //});
      res.redirect("/home");
    } else if (name !== "" && address !== "") {
      const newCustomer = new Customer({
        name: name,
        phone: phone,
        address: address,
      });
      await newCustomer.save();
      req.session.customer = newCustomer;
      //const cart = await Cart.find().populate("product");
      res.redirect("/home");
    } else {
      res.render("salesHome", {
        message: "Enter Name and Address!!",
        user: req.session.user,
        cart: await Cart.find().populate("product"),
      });
    }
  } catch (e) {
    console.log(e.message);
  }
};

const loadSalesForm = async (req, res) => {
  try {
    //const existingCustomer = await Customer.findOne({ _id: req.params.id });
    const products = await Product.find().populate("category");
    //const orders = await Order.find({ customer: req.params.id });
    const cart = await Cart.find().populate("product");
    if (true) {
      //req.session.customer = existingCustomer;

      res.render("salesEnterProduct", {
        // customer: existingCustomer,
        user: req.session.user,
        products: products,
        // orders: orders,
        cart: cart,
      });
    } else {
      res.status(401).send("Invalid");
    }
  } catch (e) {
    console.log(e.message);
  }
};

const searchProduct = async (req, res) => {
  const productName = req.body.searchString;
  if (productName.trim() === "") {
    res.json({ products: null });
    return; // Exit the function after sending the response
  } else {
    try {
      const products = await Product.find({
        productName: { $regex: new RegExp(productName, "i") },
      })
        .populate("category")
        .limit(5);

      if (!products) {
      }

      res.json({ products });
      return; // Exit the function after sending the response
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const searchProductBarcode = async (req, res) => {
  const barcode = req.body.barcode;
  try {
    const product = await Product.findOne({
      barcode: barcode,
    }).populate("category");

    if (!product) {
    }

    res.json({ product });
    return; // Exit the function after sending the response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const existingCartItem = await Cart.findOne({ product: productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      const newCart = new Cart({ product: productId, quantity: quantity });
      await newCart.save();
    }
    res.json({ data: await Cart.find().populate("product") });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteFromCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    await Cart.deleteOne({ product: productId });
    res.json({ data: await Cart.find().populate("product") });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function saveOrder(req, res) {
  try {
    // Find all items in the cart and populate the "product" field
    const cartItems = await Cart.find().populate("product");
    let give = req.body.moneygive;
    let receiveback = req.body.receiveback;
    // Calculate the total cost
    let totalCost = 0;

    const order = new Order({
      customer: req.session.customer._id,
      give: give,
      payback: receiveback,
      totalBill: totalCost,
      createdBy: req.session.user._id,
    });

    if (cartItems) {
      for (const cartItem of cartItems) {
        const quantity = cartItem.quantity;
        const productPrice = cartItem.product.retailPrice;
        const productId = cartItem.product._id;

        // Calculate the total cost for the current item
        const itemTotal = quantity * productPrice;

        // Add the item total to the overall total cost
        totalCost += itemTotal;

        // Create OrderDetails for the current item
        const orderDetail = new OrderDetails({
          order: order._id,
          product: productId,
          quantity: quantity,
          totalPrice: itemTotal,
        });

        // Save the OrderDetails to the database
        await orderDetail.save();
      }
    }
    order.totalBill = totalCost;
    await order.save();
    req.session.customer = null;
    await Cart.deleteMany();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const loadHistoryOfPurchase = async (req, res) => {
  try {
    const _id = req.body.customerId;

    const existingOrder = await Order.find({ customer: _id }).populate(
      "customer"
    );
    if (existingOrder.length > 0) {
      res.json({ data: existingOrder });
    } else {
      res.json({ message: "There are no order from this customer!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  loadLogin,
  login,
  loadCheckout,
  logout,
  loginWithToken,
  changeSalesPasswordFirstLogin,
  loadProfile,
  checkCustomer,
  addCustomer,
  loadSalesForm,
  searchProduct,
  searchProductBarcode,
  addToCart,
  deleteFromCart,
  updateProfile,
  loadHistoryOfPurchase,
};
