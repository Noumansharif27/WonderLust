# WonderLust

**A Major-project of Delta which is being repeated to refresh my knowledge about backend.**

## Initilizing a project:

**To initilize a project simply pate the following command into your CMD.**

> npm init -y

## How to start a express route:

**To start an express router you have to follow the given code Snippet.**

    // make sure that the express is installed properly into your machine.
    // to install it you have to write the following command into your terminal

> npm install express

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

    // first install the mongoose into your project but simply tying the following command in your CMD

> npm install mongoose

    const mongoose = require("mongoose"); // require the DB
    const MONGO_URL = "mongodb://127.0.0.1:12701/wonderlust" // initilizing the DB server.

    main().then(() => {
        console.log("connect to DB"); // log the success message if the opratio is succesful
    }).catch((ERR) => {
        console.log(ERR); // log-out the ERROR if we get one
    });

    async function main() {
        mongoose.connect(MONGO_URL);
    }
