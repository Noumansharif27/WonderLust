const User = require("../models/user.js");

// SignIN form
module.exports.renderingSigninForm = (req, res) => {
  res.render("users/signup.ejs");
};

//  SignIn
module.exports.signInUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to Wonderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  req.flash("success", "Welcome back to Wonderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  console.log(redirectUrl);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }

    req.flash("success", "You logout successfully!");
    res.redirect("/listings");
  });
};
