if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); //for ejs
// const { resolveSoa } = require('dns');
const methodOverride = require('method-override'); //for PUT and DELETE requests
const ejsMate = require('ejs-mate'); //for using ejs as view engine
const { wrap } = require('module');
const ExpressError = require('./utils/ExpressError'); //for handling custom errors
const { listingSchema,reviewSchema } = require('./schema.js'); //for validating listing data
// const Review = require("./models/review.js");
const session = require('express-session'); //for flash messages
const flash = require('connect-flash'); //for flash messages
const passport = require('passport'); //for authentication
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); //for authentication
 const Listing = require("./models/listing.js");
 const Review = require("./models/review.js");

 const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.urlencoded({ extended: true })); //for form data\
app.use(methodOverride('_method')); //for PUT and DELETE requests
app.engine('ejs', ejsMate); //for using ejs as view engine
app.use(express.static(path.join(__dirname, 'public'))); //for serving static files

const sessionOptions = {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week(in milliseconds)
        maxAge: 1000 * 60 * 60 * 24 * 7 ,//1 week(in milliseconds) 
        HttpOnly: true
 }
};

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to make flash messages and 
// current user available in all templates
app.use((req, res, next) => {
    // console.log(req.user);
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //to make the current user available in all templates
        
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User ({ 
//         email: "student@gmail.com",
//         username: "delta-student" //passport-local-mongoose adds username and password fields to the user schema, so we can use them here
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });   



app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", usersRouter);


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

//  app.all("/*", (req, res, next) => {
//      next(new ExpressError(404, "Page Not Found"));
//  });

 // Catch-all for unmatched routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

 app.use((err, req, res, next) => {
     let{statusCode = 500, message = "Something went wrong"} = err;
     res.status(statusCode).render("error.ejs", { err });
    //  res.status(statusCode).send(message);
 });

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})