module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You have to be login fist!");
    return res.redirect("/login");
  }
  next();
};
