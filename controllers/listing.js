const Listing = require("../models/listing.js");

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
  const { filename } = req.file;
  const url = req.file.path;
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  console.log(url, "...", filename);
  listing.image = { url, filename };
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
  console.log(listing);
  res.render("listings/edit.ejs", { listing });
};

//  Put Route
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { url, filename };
    await listing.save();
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
