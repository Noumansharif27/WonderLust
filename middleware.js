const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./SchemaValidation.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You have to be login fist!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
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

module.exports.validatingReview = (req, res, next) => {
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
