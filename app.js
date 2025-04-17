const expres = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // requiring listing model

const app = expres();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

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

app.get("/testListing", async (req, res) => {
  let listing = Listing({
    title: "My sweet House",
    description:
      "My new buy house to shift my life, and makes some new changes",
    price: 55,
    country: "Pakistan",
    location: "Lahore",
  });

  await listing.save();
  console.log("Opreating was successful.");
  res.send("successfully a new listing was added.");
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT: ${PORT}`);
});
