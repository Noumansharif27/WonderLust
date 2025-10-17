const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const { ExpressError } = require("../utils/ExpressError.js");
const { reviewSchema } = require("../SchemaValidation.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

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

// Reviews
// Post review
router.post(
  "/",
  validatingReview,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(req.params);

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review added successfully!");
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}/`);
  })
);

// Detele Reviews
router.delete(
  "/:reviewsId",
  asyncWrap(async (req, res, next) => {
    const { id, reviewsId } = req.params;
    const lising = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewsId },
    });

    const review = await Review.findByIdAndDelete(reviewsId);
    console.log(review);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
