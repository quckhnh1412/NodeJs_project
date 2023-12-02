// Import Express framework
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
mongoose.connect("mongodb://127.0.0.1:27017/final");
// Set the view engine to EJS
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "handlebars", // Specify the extension for handlebars files
  helpers: {},
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use("/", userRoute);

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
