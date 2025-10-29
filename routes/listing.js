const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const controller = require("../controllers/listing.js");

// index listing route & Post listing route
router
  .route("/")
  .get(asyncWrap(controller.index))
  // .post(isLoggedIn, validateListing, asyncWrap(controller.postNewListings));
  .post(
    isLoggedIn,
    // multer middleware must NOT be wrapped with asyncWrap — it is a plain middleware
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(controller.postNewListings)
  );

// New listing route
router.get("/new", isLoggedIn, controller.renderNewForm);

// show listing route  & Put route
router
  .route("/:id")
  .get(asyncWrap(controller.showListing))
  .put(isLoggedIn, isOwner, asyncWrap(controller.updateListing));

// Edit route
router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, asyncWrap(controller.editListing));

// Delete Listing Route
router
  .route("/:id/delete")
  .delete(isLoggedIn, isOwner, asyncWrap(controller.deleteListing));

module.exports = router;
