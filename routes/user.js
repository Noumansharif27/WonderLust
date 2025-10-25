const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res) => {
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
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failerFlash: true,
  }),
  asyncWrap(async (req, res) => {
    const { username, password } = req.body;
    req.flash("success", "Welcome back to Wonderlust!");
    res.redirect("/listings");
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }

    req.flash("success", "You logout successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
