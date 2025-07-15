const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // requiring Listing model
const Review = require("./models/review.js"); // requiring Review model
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/asyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./SchemaValidation.js");
const listing = require("./routes/listing.js");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

const validatingReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details
      .map((el) => {
        return el.message;
      })
      .join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

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

// Reviews
// Post review
app.post(
  "/listings/:id/reviews",
  validatingReview,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review added successfully!");
    res.redirect(`/listings/${id}/`);
  })
);

// Detele Reviews
app.delete(
  "/listings/:id/reviews/:reviewsId",
  asyncWrap(async (req, res, next) => {
    const { id, reviewsId } = req.params;
    const lising = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewsId },
    });

    const review = await Review.findByIdAndDelete(reviewsId);
    console.log(review);
    res.redirect(`/listings/${id}`);
  })
);

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
