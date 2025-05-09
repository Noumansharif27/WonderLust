const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "/assets/default-listing.jpg",
    set: (v) => (v === "" ? "/assets/default-listing.jpg" : v),
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
