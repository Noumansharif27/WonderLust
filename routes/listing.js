const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const controller = require("../controllers/listing.js");

// index listing route
router.get("/", asyncWrap(controller.index));

// New listing route
router.get("/new", isLoggedIn, controller.renderNewForm);

// Post listing route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  asyncWrap(controller.postNewListings)
);

// show listing route
router.get("/:id", asyncWrap(controller.showListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(controller.editListing));

// Put edit route
router.put("/:id", isLoggedIn, isOwner, asyncWrap(controller.updateListing));

// Delete Listing Route
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  asyncWrap(controller.deleteListing)
);

module.exports = router;
