const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`Welcome to root`);
});

app.listen(8080, () => {
  console.group(`Server is working!`);
});
