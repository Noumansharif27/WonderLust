const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validatingReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// Reviews

// Post review
router.post(
  "/",
  isLoggedIn,
  validatingReview,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(req.params);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
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
  isLoggedIn,
  isReviewAuthor,
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
