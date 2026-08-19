const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
     const allListings = await Listing.find({});
     res.render("./listings/index.ejs", {allListings}); 
    }

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews", 
        populate: {
            path: "author"
        }
    })
      .populate("owner");

    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    

        // if(!req.body.listing) { 
        //     throw new ExpressError(400, "Send valid listing data");
        // }
    let url = req.file.path;
    let filename = req.file.filename;
    

    const newListing = new Listing(req.body.listing);
    
    newListing.owner = req.user._id; //to associate the listing with the user who created it
    
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
    }

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    
    let originalImageURL = listing.image.url;
    originalImageUrl = originalImageURL.replace("/upload", "/upload/w_250"); //to display a smaller version of the image on the edit form

    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}    

module.exports.updateListing = async (req, res) => {
     // if(!req.body.listing) { 
    //         throw new ExpressError(400, "Send valid listing data");
    //     }

    let {id} = req.params;
    // if(!currUser && !listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit this listing!");
    //     return res.redirect(`/listings/${id}`);
    // }

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}