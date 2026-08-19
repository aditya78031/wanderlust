const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    console.log(req.params.id);   
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //to associate the review with the user who created it
    console.log("New review created");

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log("New review saved");
    // res.send("Review added successfully");

    req.flash("success", "New Review added successfully!");

     res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}