const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  console.log(listing.owner, ".....", req.user);

  // Ensure both listing owner and current user exist before comparing.
  // Use req.user._id (set by Passport) — req.user_id is incorrect.
  if (
    req.user &&
    listing.owner &&
    String(listing.owner._id) === String(req.user._id)
  ) {
    console.log("if statement is working.");
    req.flash("error", "A listing owner cannot add a review!");
    return res.redirect(`/listings/${id}`);
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${id}/`);
};

//  Destroy review
module.exports.destroyReview = async (req, res, next) => {
  const { id, reviewsId } = req.params;
  const lising = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewsId },
  });

  const review = await Review.findByIdAndDelete(reviewsId);
  console.log(review);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
