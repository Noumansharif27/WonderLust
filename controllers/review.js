const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
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
