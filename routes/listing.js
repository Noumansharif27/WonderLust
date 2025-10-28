const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index listing route
router.get("/", asyncWrap());

// New listing route
router.get("/new", isLoggedIn);

// Post listing route
router.post("/", isLoggedIn, validateListing, asyncWrap());

// show listing route
router.get("/:id", asyncWrap());

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap());

// Put edit route
router.put("/:id", isLoggedIn, isOwner, asyncWrap());

// Delete Listing Route
router.delete("/:id/delete", isLoggedIn, isOwner, asyncWrap());

module.exports = router;
