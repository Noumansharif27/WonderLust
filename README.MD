# ✨ WonderLust

A Major-project of Delta which is being repeated to refresh my knowledge about backend.

## Requirement

1. [MongoDB Server](#MongoDBServer)
2. [NodeJS](#NodeJS)

## Initilizing a project:

To initilize a project simply pate the following command into your CMD.

```bash
npm init -y
```

## How to start a express route:

**📌To start an express router you have to follow the given code Snippet.**

make sure that the express is installed properly into your machine. to install it you have to write the following command into your terminal

```bash
npm install express
```

```js
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
```

## Initilizing the DataBase:

To Initilize a DataBase you must first known which DataBase are you going to use in you project as per MERNSTACK I am using MongoDB.

📍first install the mongoose into your project but simply tying the following command in your CMD

```bash
npm install mongoose
```

```js
const mongoose = require("mongoose"); // require the DB
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"; // initilizing the DB server.

main()
  .then(() => {
    console.log("connect to DB"); // log the success message if the opratio is succesful
  })
  .catch((ERR) => {
    console.log(ERR); // log-out the ERROR if we get one
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
```

## Creating a model Listing:

To create a listing model we are creating a model repo to hold the required models for our project.

```js
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
```

`Creating a test route to see the apply changes in DB`

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

<details>
  <summary>Explination</summary>

In the above line of code we first extrat the Listing ID and Reviews ID the we find them using this IDs and afterwords by using the specia `$pull` method we found the ID of that perticular reviews and remove it from the list of Listings reviews, then delete the actual review. Because we are updating the review list in the listing so we will use `findByIdAndUpdate()` method instead of Delete one.

</details>

>

### ssue: req.params.id was undefined in the reviews router

**What happened?** After separating the routes for Listings and Reviews into different files, I noticed that when trying to access `req.params.id` inside the reviews router, it was always `undefined`. This caused problems because I needed the listing ID to add or delete reviews for a specific listing.

**What caused the problem?** The issue was due to how Express routers handle route parameters. When you mount a router with a path like `/listings/:id/reviews`, the `:id` parameter is defined in the parent route. By default, Express does not pass these parent parameters into the child router, so `req.params.id` was not available inside the reviews router.

**What was the impact?** Because `req.params.id` was undefined, any code that relied on the listing ID (such as finding the correct listing to add a review to, or redirecting after an action) would fail or behave unexpectedly. This broke the review functionality for listings.

**How did we solve it?** The solution was to tell Express to merge the parent route parameters into the child router by initializing the router with `{ mergeParams: true }`:

```js
const router = express.Router({ mergeParams: true });
```

This makes all parameters from the parent route (like `:id`) available as `req.params.id` inside the reviews router.

**How does it work now?**
With`mergeParams: true`, when a request comes to `/listings/:id/reviews`, the `id` parameter is accessible in the reviews router. This allows us to correctly find the listing, add or delete reviews, and redirect users as needed. The review routes now work as expected, and the code is cleaner and more modular.

## Cookies and Session:

`Cookies` is a small piece of data(a name/value pair) that a server asks a user's browser to store and send back with subsequent request to the same site, ookies let servers maintain state HTTPS's stateless requests.

`Session` when someone open a perticular website, it is said a session is started, and until the user logout from the website(if loged-in) or close it the session is active, we use cookies to remember that the user session is active while the user is browsing the website, session helps us to remember the user even after he browse from page to page, without session we can't remember that it was the same user or not.

## Express-Session:

```bash
npm i express-session
```

```js
const express = require("express");
const session = require("express-session");
const app = session();


const sessionOptions = {
  secret: "mysupersecretcode" // it should be a character of string unreadable to the human eye.
   resave: false,
  saveUninitialized: true, // The session safe the changes even if they haven't done something.
  cookie: {
    expires: Date.now() + 7 + 60 + 60 + 1000,
    maxAge: Date.now() + 12 + 60 + 60 + 1000,
    httpOnly: true,
  },
}

app.use(session(sessionOptions));
```

`resave: true` Save the data in a session everytime, regardless of that wether the user had changed something or not.
`resave: false` Save the data in a session if the user have changed something.

`saveUninitialized: true:` Create a local storage once the session is started, regaredless of wether the user had put something init or not.
`saveUninitialized: false:` Create a local storage everytime, regaredless of wether the user had put something init or not.

```js
app.get("/register", (req, res) => {
  const { name = "anonymous" } = req.query; // Getting an input of name from user if null assigning it anonymous.
  req.session.name = name; // storing the name into the current session.
  req.flash("success", "user added successfully!"); // Making a flash message
  res.send(`Hello ${name}`);
});

app.get("/hello", (req, res) => {
  console.log(req.flash("success")); // consoling the flash message from the previous route
  res.render("index.ejs", { name: req.session.name }); // rendring a page and passing the input name.
});
```

In the above code we created 2 routes, one is taking an input(a name) and the other is printing it out to the user on the next page. The lesson here is how we were able to remember the user name even after going to the next page & accordingly we create a custom flash message and consoling it in the terminal.

## connect-falsh (nodeJS package)

Flash is used to temporary display specific messge based on the input by the user, it gets cleared once the browser gets refresh or within some specific time.

```bash
npm i connect-flash
```

```js
const flash = require("connect-flash");
app.use(flash()); // As it is a middleware and would run between every request, that's why we have to make it app.use(flash());
```

## res.locals

Using this property variable defined init are accessable in the templates render with `res.render`, the variable set in res.locals are accessable within the `single request-response `cycle, and will not be shared between requests.

```js
app.get("/register", (req, res) => {
  const { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("success", "user not registered successfully!");
  } else {
    req.flash("success", "user registered successfully!");
  }
  res.redirect("hello");
});

app.get("/hello", (req, res) => {
  res.locals.message = req.flash("success");
  res.render("index.ejs", { name: req.session.name });
});
```

## 🔐 Authentication:

Authentication is the process of identifing who some is, are they really this person whome they pretends or not.

## ⚙ Authorization

Authorization is the process of managing access to the aunthnticated person, e.g which documents they can access, which queries they can perform.

**How we store passwords?**
We never store passwords as it is. e.g password: user@123, password_stored: 1234jhwjkw2231kxdsasjkjk21njkasdjnk2.
It is called `Hashing`, it is an algoritam which is used to convert password in an unreadable format. it is almost impossible to restore the original password after hashing, there are any hanshing algorithem avaliable out there.

**Hashing:**
Hashing is an algorithem used to encrypt the password in a form that they cannot be decrupt to its original form.

**Hashing tasks:**

- for every input, there is a fixed length output.
- They are oneway function, we can't get input from output.
- For the diferent input there is a different output but same length.
- Small changes in input will bring large changes in output.

**If it is impossiable to recover the hashed password, then how come we know it is wrong or correct?**
As we say it is impossibale to hash-back the password, and we also known that if two the inputs are same then their output will be same as well. To Authenticate our user we get the password and hash it then copare it to the original stored password if both hash matches then we consider the password correct, or else we say it is wrong.

## Salting:

Password salting is a technique to protect passwords stored in the database by adding a string of 32 characters or more and then hashing them.

## Passport:

A npm package that helps to authenticate and aurhorize the users.

`Installation: `

```bash
npm i passport
npm i passport-local
npm i passport-local-mongoose
```

`Usage`

```js
app.use(passport.initialize());
```

initilizing the passport middleware before using it.

```js
app.use(passport.session());
```

A web browser needs the ability to identify the user as they browse through page to page, this series of request and response, each associates with the same user and sae browser is know a session.

```js
passport.use(new LocalStratey(User.authenticate()));
```

Using passport middleware and local strategy to authenticate the user(login/signup)

```js
passport.serializeUser(User.serializeUser());
```

Storing the unsaved user information or moving it into the storage.

```js
passport.deserializeUser(User.deserializeUser());
```

**Creating a demo user:**

```js
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "helloworld@gmail.com",
    username: "Hamad",
  });

  const demoUser = await User.register(fakeUser, "helloworld"); // Registering the user
  res.send(demoUser);
});
```

If we try to re-register the user again with the same username we will always get an error from DB.

## Login/signUp:

using passport we can sign a user into db and hash their passowrd, and also we can login them.

`Defining a user module:`

```js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose); // Initilizing passport to mongoDB specific.

module.exports = mongoose.model("User", userSchema);
```

we don't need to define `username` & `password` fields for user model, as passport has already defined it.

```js
const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // user model
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");

// rendering the signup route
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// registering the user
router.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Wonderlust!");
      res.redirect("/listings");
    } catch (err) {
      // if we get unexpectedly some passport authentication error we would catch them without crashing
      console.log(err);
      res.redirect("/signup");
    }
  })
);

// rendering the login route
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failerFlash: true,
  }),
  asyncWrap(async (req, res) => {
    const { username, password } = req.body;
    req.flash("success", "Welcome back to Wonderlust!");
    res.redirect("/listings");
  })
);

module.exports = router;
```

```js
passport.authenticate("local", {
  failureRedirect: "/login",
  failerFlash: true,
});
```

it is a middleware use to authenticate the user, by getting the info wether he already exists in the database or not.
