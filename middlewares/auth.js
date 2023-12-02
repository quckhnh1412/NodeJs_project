const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
    } else {
      res.redirect("/");
    }
    next();
  } catch (e) {
    console.log(e.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/home");
    }
    next();
  } catch (e) {
    console.log(e.message);
  }
};
module.exports = { isLogin, isLogout };
