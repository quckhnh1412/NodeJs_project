NodeJS_N41
This is a Node.js application that uses Express.js for routing and Handlebars for views. The application is structured following the MVC (Model-View-Controller) pattern.

Structure
The application is divided into several parts:

app.js: This is the main entry point of the application.

controllers/: This directory contains the controller files for different parts of the application, such as admin, category, product, and user.

middlewares/: This directory contains middleware files. Currently, it includes auth.js for authentication.

models/: This directory contains the model files for different entities in the application, such as Cart, Category, Customer, Order, OrderDetails, Product, and User.

public/: This directory contains static files served by the application, including CSS, JavaScript, and images.

routes/: This directory contains the route files for different parts of the application.

utils/: This directory contains utility files. Currently, it includes connection.js for database connection.

views/: This directory contains Handlebars view templates.
