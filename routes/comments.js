// We'll make our variables work with the Express Router
var express = require("express");
var router = express.Router({mergeParams: true});  // mergeParams needed for logging in, so we can access params from our other routes files
    // We then add all routers to router. instead of app. router.get, router.post, etc...

// We also need to define any variables and models missing, like Campground
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = require("../middleware"); // Middleware folder
    // We just specify the directory, "index.js" is a special name that
    //   automatically gets loaded when we specify a dir

// ===========================
// COMMENTS ROUTES
// NEW  COMMENT ==============
router.get("/new", middleware.isLoggedIn, function(req, res){  // our app.js has the line app.use("/campgrounds/:id/comments", commentRoutes);
    // find campground by ID and send through when we render
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Could not add comment.");
            console.log(err);
        } else {
            
            res.render("comments/new", {campground: campground, currentUser: req.user});
        }
    });
});

// POST route comments
router.post("/", middleware.isLoggedIn, function(req, res){   // app.use("/campgrounds/:id/comments", commentRoutes);
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        } else {
            //console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, savedComment){
                if(err){
                    req.flash("error", "Could not add comment.");
                    console.log(err);
                } else {
                    // Add username and ID to comment, instead of having the user type it in
                    //console.log("New comment's username will be: " + req.user.username);
                    savedComment.author.id = req.user._id;
                    savedComment.author.username = req.user.username;
                    savedComment.save(); // we need to save the comment
                    console.log("Comment saved: " + savedComment);
                    // Here we associate the comment with the campground-from-callback
                    campground.comments.push(savedComment);
                    campground.save();
                    req.flash("success", "Comment added.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        // We have to query the database to get the comment associated with this req
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
    
    // That's the campground we get in req.params.id, NOT the comment ID
});

// UPDATE comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Could not update comment.");
            res.redirect("back");
        } else {
            // redirect back to the Show page
            req.flash("success", "Comment updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        // Tricky, had to use the .comment_id. we could console.log the params.coment_id to test
        if(err){
            req.flash("error", "Could not delete comment. Something went wrong.");
            res.redirect("/campgrounds");
        } else {
            //console.log("DELETE COMMENT ROUTE hit");
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// And we need to export the router back to the main app.js
module.exports = router;