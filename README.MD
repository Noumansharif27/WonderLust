# WonderLust

**A Major-project of Delta which is being repeated to refresh my knowledge about backend.**

## Initilizing a project:

**To initilize a project simply pate the following command into your CMD.**

`npm init -y`

## How to start a express route:

**To start an express router you have to follow the given code Snippet.**

    // make sure that the express is installed properly into your machine.
    // to install it you have to write the following command into your terminal

`npm install express`

    const express = require("express") // require the express.

    const app = express(); // initilize the special express object to the app veriable.
    const PORT = 3000 // set a port, in my case it's 3000.

    // make a route
    app.get("/", (req, res) => {
        res.send("Welcome to index route");
    })

    // start the server
    app.listen(PORT, () => {
        console.log(`App is listening at PORT: ${PORT}");
    })

## Initilizing the DataBase:

**To Initilize a DataBase you must first known which DataBase are you going to use in you project as per MERNSTACK I am using MongoDB.**

    first install the mongoose into your project but simply tying the following command in your CMD

`npm install mongoose`

    const mongoose = require("mongoose"); // require the DB
        const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust" // initilizing the DB server.

    main().then(() => {
        console.log("connect to DB"); // log the success message if the opratio is succesful
        }).catch((ERR) => {
            console.log(ERR); // log-out the ERROR if we get one
        });

    async function main() {
        await mongoose.connect(MONGO_URL);
    }

## Creating a model Listing:

**To create a listing model we are creating a model repo which will hold the required models for our project.**

    const mongoose = require("mongoose");
        const Shcema = mongoose.Schema;

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
        default: "/public/assets/default-listing.jpg",
        set: (v) => (v === "" ? "/public/assets/default-listing.jpeg" : v),
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

**_Creating a test route to see the apply changes in DB_**

```js

    const expres = require("express");
    const mongoose = require("mongoose");
    const Listing = require("./models/listing.js"); // requiring listing model
    const path = require("path");

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
        const listing = Listing.insertOne({
            title: "MY new House",
            description: "A new house for my new life."
            price: 355,
            country: "Pakistan",
            location: "kachi Deri, Mahansehrah",
        });

        await listing.save();
        res.send("Listing added successfully.");
    });

    app.listen(PORT, () => {
        console.log(`App is listening at PORT: ${PORT}`);
    });
```

`Delete a review from the its collection also delete its pointer id from its parent listing.`

```js
// Detele Reviews
app.delete(
  "/listings/:id/reviews/:reviewsId",
  asyncWrap(async (req, res, next) => {
    const { id, reviewsId } = req.params;
    const lising = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewsId },
    });

    const review = await Review.findByIdAndDelete(reviewsId);
    console.log(review);
    res.redirect(`/listings/${id}`);
  })
);
```

> In the above line of code we first extrat the Listing ID and Reviews ID the we find them using this IDs and afterwords by using the specia `$pull` method we found the ID of that perticular reviews and remove it from the list of Listings reviews, then delete the actual review. Because we are updating the review list in the listing so we will use `findByIdAndUpdate()` method instead of Delete one.

### ssue: req.params.id was undefined in the reviews router

> **What happened?** After separating the routes for Listings and Reviews into different files, I noticed that when trying to access `req.params.id` inside the reviews router, it was always `undefined`. This caused problems because I needed the listing ID to add or delete reviews for a specific listing.
> **What caused the problem?** The issue was due to how Express routers handle route parameters. When you mount a router with a path like `/listings/:id/reviews`, the `:id` parameter is defined in the parent route. By default, Express does not pass these parent parameters into the child router, so `req.params.id` was not available inside the reviews router.

> **What was the impact?** Because `req.params.id` was undefined, any code that relied on the listing ID (such as finding the correct listing to add a review to, or redirecting after an action) would fail or behave unexpectedly. This broke the review functionality for listings.

> **How did we solve it?** The solution was to tell Express to merge the parent route parameters into the child router by initializing the router with `{ mergeParams: true }`:

```js
const router = express.Router({ mergeParams: true });
```

> This makes all parameters from the parent route (like `:id`) available as `req.params.id` inside the reviews router.

> **How does it work now? With** `mergeParams: true`, when a request comes to `/listings/:id/reviews`, the `id` parameter is accessible in the reviews router. This allows us to correctly find the listing, add or delete reviews, and redirect users as needed. The review routes now work as expected, and the code is cleaner and more modular.
