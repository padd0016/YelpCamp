// We'll make our variables work with the Express Router
var express = require("express");
var router = express.Router();
    // We then add all routers to router. instead of app. router.get, router.post, etc...
var passport = require("passport");  // needed because we're calling Passport in these routes
var User = require("../models/user");  // needed to point to the user model file


router.get("/", function(req, res){
    res.render("landing", {currentUser: req.user});
    // EJS notes: We need to make a new directory valled 'views' for Express to render this
    // We ALSO need to NPM install ejs --save
    // res.redirect("/search"); // to make hopepage redirect to Search
});


// AUTH routes
router.get("/register", function(req, res){
    res.render("register", {currentUser: req.user});
});
// Copied from authentication/AuthDemo app.js
router.post("/register", function(req, res){
    // creating new user in its own VAR for cleanup
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        // we start with a new User, just with the username. (no password; we don't want to save plaintext pwds)
        //  User.register takes as arguments 1. new user object, 2. password to be hashed, and 3. callback func
        //  If all works well, it should pass back the user it created
        if(err){
            console.log(err);  
            // return res.render("register", {"error": err.message}); a solution from the vid comments
            req.flash("error", err.message);    // This didn't work at first. Per the lesson's comments, using this instead:
            return res.redirect("/register");  // "return" guarantees we'll excape out, if err.
        } else {
            // If the user registration was successful:
            passport.authenticate("local")(req, res, function(){
                // This logs the user in if they registered successfully
                //   Using the "local" strategy. We could instead use Twitter or FB here
                console.log("New user created!");
                req.flash("success", "User created. Welcome to the community, " + user.username + "!");
                res.redirect("/campgrounds"); // the page you get to when you login
            });
        }
    });
});

// Login and Logout routes, copied from AuthDemo
router.get("/login", function(req, res){
    res.render("login", {currentUser: req.user});
});

// Login post route

// Splitting this function out, fires the function but DID NOT WORK
// function logMeIn(){
//     console.log("Hit the logMiIn function...");
//     passport.authenticate("local", {
//         successRedirect: "/campgrounds",
//         failureRedirect: "/login"
//     });
// }
// app.post("/login", logMeIn, function(req, res){
//     console.log("Callback function after login");
// });


router.post("/login", passport.authenticate("local", {
    // We call the passport authenticate as a second "middleware" argument in our app.post
    // That takes two arguments: the strategy, and an object with success/fail redirects
    successRedirect: "/campgrounds",
    successFlash: "Login successful. Welcome back!",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
    // We could have other middleware running here
    }), function(req, res){
    // Nothing needs to be in this final callback function yet
    console.log("This is the callback function after login. Nothing should hit it.");
});

// And finally a LOGOUT route that uses middleware if we need, and redirects
router.get("/logout", function(req, res){
    // Passport just has one line to log out
    req.logout(); // destroys user data in session
    req.flash("success", "You have logged out. Bye!");    // send flash logout message on next page loaded
    res.redirect("/");
});


// Middleware to verify if a user is logged in
    // Moved to middleware/index.js

// router.get("*", function(req, res){
//     console.log("they tried to go to");
//     console.log(req.params);
//     res.send("404: page " + req.params[0] + " not found, yelper.");
// });

// And we need to export the router back to the main app.js
module.exports = router;