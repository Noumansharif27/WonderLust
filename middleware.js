module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You have to be loggedin fist!");
    return res.redirect("/login");
  }
  next();
};
