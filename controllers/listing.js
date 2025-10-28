const Listing = require("../models/listing.js");

module.exports.indexRoute = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// New Route
module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

// Post Route
module.exports.postRoute = async (req, res, next) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  await listing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
};

// Show Route
module.exports.showRoute = async (req, res) => {
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
module.exports.editRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you're looking for doesn't exists");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/edit.ejs", { listing });
};

//  Put Route
module.exports.putRoute = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing edit successfully!");
  res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  console.log(`${listing} You deleted the above listing.`);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
