// Import Express framework
const express = require('express');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// Set the views directory to the "views" folder

// Set up a basic route to render an EJS template
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
