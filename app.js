// requiring the .env file and using it once in production
if (process.env_NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratey = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 + 60 + 60 + 1000,
    maxAge: Date.now() + 12 + 60 + 60 + 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((ERR) => {
    console.log(ERR);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // Required so that passport should know how is accessing the web even after changing the tab
passport.use(new LocalStratey(User.authenticate())); // Authenticating (login/signup) user

passport.serializeUser(User.serializeUser()); // storing user information or moving the in a session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
  // res.redirect("/listings");
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "helloworld@gmail.com",
//     username: "Hamad",
//   });

//   const demoUser = await User.register(fakeUser, "helloworld");

//   const user = await User.find();
//   // console.log(user);
//   res.send(demoUser);
// });

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT: ${PORT}`);
});
