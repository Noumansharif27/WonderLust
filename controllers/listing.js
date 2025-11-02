const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_PUBLIC_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// New Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Post Route
module.exports.postNewListings = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();

  const { filename } = req.file;
  const url = req.file.path;
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  console.log(url, "...", filename);
  listing.image = { url, filename };
  listing.geometry = response.body.features[0].geometry;

  console.log(listing.geometry);
  await listing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
};

// Show Route
module.exports.showListing = async (req, res) => {
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
};

// Edit Route
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you're looking for doesn't exists");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//  Put Route
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let newListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (!newListing) {
    req.flash("error", "The listing your wants to edit, doesn't exists!");
    return res.redirect("/listings");
  }

  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    newListing.image = { url, filename };
    await newListing.save();
  }
  req.flash("success", "Listing edit successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  console.log(`${listing} You deleted the above listing.`);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
