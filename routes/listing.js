const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../SchemaValidation.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
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

// index listing route
router.get(
  "/",
  asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New listing route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Post listing route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  asyncWrap(async (req, res, next) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings");
  })
);

// show listing route
router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you're looking for doesn't exists");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  })
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you're looking for doesn't exists");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/edit.ejs", { listing });
  })
);

// Put edit route
router.put(
  "/:id",
  isLoggedIn,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing edit successfully!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Listing Route
router.delete(
  "/:id/delete",
  isLoggedIn,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    console.log(`${listing} You deleted the above listing.`);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;
