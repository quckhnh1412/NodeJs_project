// Import Express framework
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const flash = require("express-flash");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

mongoose.connect("mongodb://127.0.0.1:27017/final");

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "handlebars", // Specify the extension for handlebars files
  helpers: {},
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/", userRoute);
app.use("/admin", adminRoute);

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
