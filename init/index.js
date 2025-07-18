const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB.");
    return initilizeData(); // adding demo data
  })
  .catch((ERR) => {
    console.log(ERR);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initilizeData() {
  await Listing.deleteMany({}); // delete the previous data.
  await Listing.insertMany(data);

  console.log("Data was initilizes.");
}
