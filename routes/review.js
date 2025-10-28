const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const controller = require("../controllers/review.js");

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
  asyncWrap(controller.createReview)
);

// Detele Reviews
router.delete(
  "/:reviewsId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(controller.destroyReview)
);

module.exports = router;
