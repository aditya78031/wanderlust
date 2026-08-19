const express = require("express");
const router = express.Router({mergeParams: true}); //to access params from parent route
const wrapAsync = require('../utils/wrapAsync'); //for handling async errors
const ExpressError = require('../utils/ExpressError'); //for handling custom errors
// const { reviewSchema } = require('../schema.js'); //for validating listing data
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); //for validating review data

const reviewController = require("../controllers/reviews.js");


//Review Routes(Post)
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview)
);

//Delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
