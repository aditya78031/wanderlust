// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: String,
//     image: {
//          type: String,
//          default: "https://unsplash.com/photos/black-leafed-tree-near-gazebo-6uEtb1fLX7E",
//          set: (v) =>
//          v === ""
//           ? "https://unsplash.com/photos/black-leafed-tree-near-gazebo-6uEtb1fLX7E" 
//           : v,
//     },
//     price: Number,
//     location: String,
//     country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if(listing)
  await Review.deleteMany({ _id: { $in: listing.reviews } }
  );
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;