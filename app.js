// Import Express framework
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

// Set the view engine to EJS
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "handlebars", // Specify the extension for handlebars files
  helpers: {},
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
// Set the views directory to the "views" folder

// Set up a basic route to render an EJS template

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/home", (req, res) => {
  res.render("index");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
