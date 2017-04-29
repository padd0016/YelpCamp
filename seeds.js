var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var starterData = [
    {
        name: "Cold Glacier Park",
        image: "https://farm5.staticflickr.com/4133/5060612369_7850e300a2.jpg",
        description: "Godard chartreuse viral, chambray artisan selvage man braid jean shorts brooklyn hexagon everyday carry. Chicharrones yuccie four dollar toast, leggings semiotics trust fund retro YOLO activated charcoal dreamcatcher. Skateboard put a bird on it 90's polaroid snackwave hot chicken. Direct trade vinyl fanny pack umami, gochujang glossier kickstarter vaporware prism. Mixtape before they sold out trust fund flannel crucifix hell of. Hoodie raclette bespoke twee, fam live-edge vice mixtape vexillologist. Pinterest XOXO activated charcoal banh mi, waistcoat swag williamsburg jean shorts typewriter messenger bag woke sartorial portland."
    },
    {
        name: "Cruise Stop Park",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        description: "Intelligentsia offal activated charcoal, brunch tilde williamsburg hot chicken street art salvia cornhole cardigan quinoa narwhal plaid man bun. Blog paleo try-hard cronut. Knausgaard street art migas 8-bit irony, 90's cornhole four loko kinfolk. Vaporware chambray portland forage, health goth selvage vice try-hard af. Distillery blog plaid copper mug, PBR&B hashtag meh godard four dollar toast fam brooklyn taxidermy cray butcher la croix. Sriracha lomo cronut cliche, four loko brooklyn gochujang literally kombucha fixie woke cornhole. Blue bottle portland echo park intelligentsia."
    },
    {
        name: "The Road Less Traveled",
        image: "https://farm3.staticflickr.com/2801/4504029335_e875b05082.jpg",
        description: "Knausgaard mlkshk viral cold-pressed hammock four dollar toast. Kale chips truffaut hell of, helvetica tacos umami jianbing skateboard. 8-bit deep v leggings organic occupy cray, microdosing fanny pack flannel tattooed authentic paleo pop-up pinterest wolf. Typewriter humblebrag mlkshk put a bird on it, tacos fixie YOLO sartorial mumblecore umami yuccie skateboard. Air plant asymmetrical everyday carry, chillwave flexitarian +1 3 wolf moon pabst blue bottle poutine vice XOXO enamel pin. Vegan venmo swag snackwave, lo-fi twee beard offal biodiesel fap vinyl af cold-pressed. Banh mi raw denim gentrify chia retro."
    }
    
];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("REMOVED campgrounds");
        // Add starter campgrounds.
        // DO this HERE in the callback to ensure it happens in the right order
        // starterData.forEach(function(seed){
        //     Campground.create(seed, function(err, campground){
        //         if(err){
        //             console.log(err);
        //         } else {
                // console.log("added campground");
                // // creating comments here, inside this callback
                // Comment.create(
                //     {text: "Wish there was internet here", author: "Homer"}, function(err, comment){
                //         if(err){
                //             console.log("Got an error adding starter comments");
                //         } else {
                //             console.log("Starter Comment Added");
                //             // console.log(comment);
                //             campground.comments.push(comment);
                //             campground.save(); // this campground is from the create callback
                //         }
                //     }
                //     );
        //         }
        //     });
        // });
    // Add starter comments
    
    });
}

module.exports = seedDB;
    // This makes this func available to anything that requires seeds.js