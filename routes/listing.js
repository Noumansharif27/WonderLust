const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

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
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you're looking for doesn't exists");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
  isOwner,
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
  isOwner,
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    console.log(`${listing} You deleted the above listing.`);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;
