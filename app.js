var express     = require("express"),
    app         = express(),
    request     = require('request'),
    bodyParser  = require("body-parser"),
    seedDB      = require("./seeds.js"),
    passport    = require("passport"),
    mongoose    = require("mongoose"),
    LocalStrategy       = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Campground  = require("./models/campground.js"),
    User        = require("./models/user"),
    methodOverride      = require("method-override"),
    Comment     = require("./models/comment.js"),
    flash       = require("connect-flash");

// Since we moved our routes to other files, we need to require them here

var campgroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes = require("./routes/comments.js"),
    
    indexRoutes = require("./routes/index.js");
  
    // If we're doing a bunch of Requires and declarations, we can
    //   put them together into one var statement, which makes all
    // Also, some ppl prefer to tab them like above for clarity

app.use(flash());  // lets us use flash messages

app.use(methodOverride("_method")); // lets us use Method Override    
app.use(bodyParser.urlencoded({extended: true}));
// seedDB(); // runs seedDB every time we start our server
mongoose.connect("mongodb://localhost/yelp_camp"); // Will try to connect, and will create the db collection if it doesn't exist
app.set("view engine", "ejs"); // allows us to assume ejs extension
// If we want Express to load custom CSS or whatever, we need to specify the path here
app.use(express.static(__dirname + "/public"));
    // console.log(__dirname);
    // This __dirname gives the directory this script was run in
    // This is safer, in case the directory structure gets changd

// PassportJS configuration
app.use(require("express-session")({
    secret: "Braham Cigar fanta jubilee",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // all the parens!()
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){       // This passes in the currentUser into EVERY route!
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); // We can pass in other things to give to every route
    res.locals.success = req.flash("success");  // We can have multiple messages
        // This lets us pass in Flash to our header.ejs, so it's defined everywhere
    next();
});

// *** These app.use refactors must be below the passport.use and database connection strings! All kinds of errors logging in otherwise.
    // They also must be after the req.user middleware, or we'll have to pass in the user in every single route
    // These are passed back from our refactored Routes files
app.use("/campgrounds", campgroundRoutes);   // DRYs up code, if all the routes inside start with /campgrounds. Remove /campgrounds in that .js file!
app.use("/campgrounds/:id/comments", commentRoutes); 
app.use(indexRoutes);  // Can't DRY further, since there's a mix of route beginnings



// SCHEMA SETUP for campgrounds
    // MOVED to campground.js

// *** Campground routes moved to campgrounds.js

// *** Comment routes moved to comments.js

// *** All other routes moved to index.js

    // Upside: cleaner app.js file, easier to read, more re-usable modular code
    // Downside: more redundant code for Requires etc... on the sub-files

// 404 route
app.get("*", function(req, res){
    console.log("they tried to go to");
    console.log(req.params);
    res.send("404: page " + req.params[0] + " not found, yelper.");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Our Yelpcamp server is listening...");
});
