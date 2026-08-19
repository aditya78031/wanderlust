const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    
    try {
    let { username, password, email } = req.body;
    const newUser = new User({ username, email });
    // console.log(newUser)
    //register is a method provided by passport-local-mongoose to create a new user and hash the password
    const registeredUser = await User.register(newUser, password); 
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });

    // req.flash("success", "Welcome to Wanderlust!");
    // res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    // console.log(req.user);
   req.flash("success", "Welcome back to Wanderlust! You are now logged in.");

//    res.redirect(req.session.redirectUrl || "/listings");

/*After successful login, we want to redirect the user to the page they were
 trying to access before being redirected to the login page.*/

   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
};