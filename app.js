const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // requiring listing model
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((ERR) => {
    console.log(ERR);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Welcome to index route");
});

// index listing route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New listing route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Post listing route
app.post("/listings", async (req, res) => {
  const listing = new Listing(req.body.listing);
  await listing.save();
  res.redirect("/listings");
});

// show listing route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  res.render("listings/show.ejs", { listing });
  console.log(`here is your requested listing: ${listing}`);
});

// Edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/edit.ejs", { listing });
});

// Put edit route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  res.redirect(`/listings/${id}`);
});

// Delete route
app.delete("/listings/:id/delete", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);

  console.log(listing);
  res.redirect("/listings");
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT: ${PORT}`);
});
