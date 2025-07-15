const express = require("express");
const Router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { ExpressError } = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewShema } = require("../SchemaValidation.js");

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
Router.get(
  "/listings",
  asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New listing route
Router.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Post listing route
Router.post(
  "/listings",
  validateListing,
  asyncWrap(async (req, res, next) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  })
);

// show listing route
Router.get(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    res.render("listings/show.ejs", { listing });
  })
);

// Edit route
Router.get(
  "/listings/:id/edit",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", { listing });
  })
);

// Put edit route
Router.put(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect(`/listings/${id}`);
  })
);

// Delete Listing Route
Router.delete(
  "/listings/:id/delete",
  asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    console.log(`${listing} You deleted the above listing.`);
    res.redirect("/listings");
  })
);

module.exports = Router;
