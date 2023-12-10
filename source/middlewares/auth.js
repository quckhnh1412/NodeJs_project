const isLogin = async (req, res, next) => {
  try {
    if (req.session.user && req.session.user.role === "salesperson") {
      // If the user is a salesperson, continue to the next middleware
      next();
    } else {
      // If not a salesperson, redirect to the home page or login page
      res.redirect("/"); // You might want to redirect to the login page
    }
  } catch (e) {
    console.error("Error in isLogin middleware:", e.message);
    // Handle the error as needed
    res.status(500).send("Internal Server Error");
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user && req.session.user.role === "salesperson") {
      // If the user is a salesperson, redirect to the home page
      res.redirect("/home");
    } else {
      // If not a salesperson, continue to the next middleware
      next();
    }
  } catch (e) {
    console.error("Error in isLogout middleware:", e.message);
    // Handle the error as needed
    res.status(500).send("Internal Server Error");
  }
};
const checkAdminRole = (req, res, next) => {
  try {
    if (req.session.user && req.session.user.role === "admin") {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error in checkAdminRole middleware:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const redirectIfAdminLoggedIn = (req, res, next) => {
  try {
    if (req.session.user && req.session.user.role === "admin") {
      // Uncomment the line below if you want to redirect admin to a different page
      // res.redirect("/admin/home");
    } else {
      next();
    }
  } catch (error) {
    console.error(
      "Error in redirectIfAdminLoggedIn middleware:",
      error.message
    );
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { isLogin, isLogout, checkAdminRole, redirectIfAdminLoggedIn };
