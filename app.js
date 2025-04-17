const expres = require("express");
const mongoose = require("mongoose");

const app = expres();
const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:12707/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((ERR) => {
    console.log(ERR);
  });

async function main() {
  mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Welcome to index route");
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT: ${PORT}`);
});
