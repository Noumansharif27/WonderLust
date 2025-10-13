const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({
    secret: "myDeepDarkSecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/test", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`You are here ${req.session.count} times!`);
});

app.listen(3000, () => {
  console.group(`Server is working!`);
});
