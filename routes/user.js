const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controller = require("../controllers/user.js");

router.get("/signup", controller.renderingSigninForm);

router.post("/signup", asyncWrap(controller.signInUser));

router.get("/login", controller.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failerFlash: true,
  }),
  asyncWrap(controller.loginUser)
);

router.get("/logout", controller.logout);

module.exports = router;
