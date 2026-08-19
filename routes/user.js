const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync'); //for handling async errors
const passport = require('passport'); //for authentication
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/users.js");
const { render } = require('ejs');
const user = require('../models/user.js');

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router
.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl, //to save the url the user is trying to access before being redirected to login page
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), 
(userController.login)
);


/*passport.authenticate is a middleware provided by passport to handle authentication. 
  It takes the strategy as the first argument and options as the second argument. 
  In this case, we are using the local strategy which is provided by passport-local-mongoose. 
  The options we are passing are failureRedirect and 
  failureFlash which will redirect the user back to the login page and flash an error message
  if authentication fails.
*/
  
/*logout route to log the user out and redirect them to the
  listings page with a success message */
  
router.get("/logout", (userController.logout));

module.exports = router;