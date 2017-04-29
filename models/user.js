// file with user model for mongoose

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);
    // This adds new methods to our UserSchema model

module.exports = mongoose.model("User", UserSchema);