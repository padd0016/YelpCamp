// We'll make our variables work with the Express Router
var express = require("express");
var router = express.Router();
    // We then add all routers to router. instead of app.
// We also need to define any variables and models missing, like Campground
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // Middleware folder
    // We just specify the directory, "index.js" is a special name that
    //   automatically gets loaded when we specify a dir
    

// RESTful "Index route"
router.get("/", function(req, res){
    // console.log(req.user); // contains username info. Useful for checking if a user is logged in!
    if(req.user){ // testing user logged in
        console.log("The current user is: " + req.user.username);
    } else {
        console.log("No user logged in yet.......");
    }
    // We'll pull ALL campgrounds from the database
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("Got an error!");
            console.log(err);
        } else {
            console.log("Retrieved CGs from database.");
            // console.log(allCampgrounds);
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user}); // pass in current user 
        }
    });
    // res.render("campgrounds", {campgrounds:campgrounds}); // destination-name, orig name
});

// RESTful "New route" - show form to add new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// REST convention: name the post req the same as the get
// RESTful "Create route" - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    // We'll create an object for the author of the campground, and pass it in when we create
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author, price: price};
    // console.log("CAMPGROUND POST ROUTE USER: " + req.user);
    // Let's add a Campground to the database:
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            // If there is an error, we want to send them back to the New form with a message why
            req.flash("error", "Could not save campground.");
            console.log(err);
        } else {
            req.flash("success", "Campground added.");
            //console.log(newlyCreated);
        }
    });
    // campgrounds.push(newCampground);
    // redirect back to Campgrounds page
    res.redirect("/campgrounds");
});


// RESTful "Show route" - lets us show the full details on one campground, comments, etc...
router.get("/:id", function(req, res){
    // This should fetch info about that campground ID, and then do the Show route with that info
    // Mongoose gives us a method FindByID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        // That will include comments
        if(err){
            console.log(err);
        } else {
            console.log("Found a campground");
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Campground Route, get request
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // console.log("Route to get to the edit page");
    Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
    });
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    // If we hadn't wrapped the name/image/desc in campground[], we could make an object here
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Could not delete campground.");
            res.redirect("/campgrounds");
        } else {
            req.flash("error", "Campground deleted.");
            res.redirect("/campgrounds");
        }
    });
});

// Middleware refactored: isLoggedIn and isCampgroundOwner. Moved to middleware/index.js

// And we need to export the router back to the main app.js
module.exports = router;