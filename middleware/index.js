var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All middleware goes here
    // We could have split them up though, into Comment middleware, Campground middleware, etc...
    
var middlewareObj = {
    // We could define all the functions in here, or separately
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            console.log("isAuthenticated passed!");
            // Does the current user own the campground? Let's first find the campground
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Permission denied.");
                    res.redirect("back"); // sends them to their previous page
                } else {
                // does user own comment?
                // Warning: foundComment.author.id looks like a string, but isn't.
                // Mongoose findById gives us a special method .equals(whatev) for this to help:
                    if(foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must login to do that.");
            res.redirect("back"); // sends them to their previous page
        }
    
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            console.log("isAuthenticated passed!");
            // Does the current user own the campground? Let's first find the campground
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found.");
                    res.redirect("back"); // sends them to their previous page
                } else {
                // does user own campground?
                // Warning: foundCampground.author.id looks like a string, but isn't.
                // Mongoose findById gives us a special method .equals(whatev) for this to help:
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "Permission denied.");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "Login required.");
            res.redirect("back"); // sends them to their previous page
        }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // flash message
    req.flash("error", "Login Required."); // This makes a flash message on the next page, not immediately
        // "error" isn't special, just a key we use to differentiate messages.
    res.redirect("/login"); // where we send them if they aren't logged in
}

// All these need this file:
module.exports = middlewareObj; // will contain all middleware objects
// Or we could have set module.exports = {all our functions}