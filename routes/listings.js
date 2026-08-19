const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync'); //for handling async errors
// const ExpressError = require('../utils/ExpressError'); //for handling custom errors
// const { listingSchema,reviewSchema } = require('../schema.js'); //for validating listing data
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); //for checking if user is logged in before creating a listing

const listingController = require("../controllers/listings.js"); //for separating route handlers from route definitions
const multer  = require('multer')
const { storage } = require("../cloudConfig.js"); //for cloudinary storage configuration
const upload = multer({ storage })

// let { title, description, price, location, country } = req.body;
// let listing = req.bo;

router
.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    
    wrapAsync(listingController.createListing)
);

//New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show route & Update route & delete route
router.
route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner, //to check if the user is the owner of the listing before allowing them to edit it
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// //Create route
// router.post(
//     "/", 
//     isLoggedIn,
//     validateListing,
//     // let { title, description, price, location, country } = req.body;
//     // let listing = req.body.listing;
//     wrapAsync(listingController.createListing)
//     // console.log(listing);
// );

//edit route
router.get(
    "/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports = router;