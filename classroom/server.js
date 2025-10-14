const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "myDeepDarkSecret", // A secreat code which is best to be not read by human
    resave: false, // forces the session to safe in the session store even if the session is not modified during the request, Default is true
    saveUninitialized: true, // Forces the session to save that is uninitilized, new or not modified to be saved to the session store
  })
);

// Using express-session to create a new variable for tracking the request quantity sent by the user.
app.get("/test", (req, res) => {
  if (req.session.count) {
    req.session.count++; // Incremeting if exists
  } else {
    req.session.count = 1; // Initilizing if not exists
  }
  res.send(`You are here ${req.session.count} times!`);
});

app.listen(3000, () => {
  console.group(`Server is working!`);
});

app.get("/register", (req, res) => {
  const { name = "anonymous" } = req.query;
  console.log(name);
  res.send(`Hello ${name}`);
});
