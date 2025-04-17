const expres = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // requiring listing model
const path = require("path");

const app = expres();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// show listing route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  res.render("listings/show.ejs", { listing });
  console.log(`here is your requested listing: ${listing}`);
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT: ${PORT}`);
});
