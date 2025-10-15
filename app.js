const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const session = require("express-session");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitilized: true,
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
app.use(session(sessionOptions));

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

app.get("/", (req, res) => {
  res.send("Welcome to index route");
});

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);

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
