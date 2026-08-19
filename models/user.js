const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

// console.log(passportLocalMongoose);


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});


//this is for passport-local-mongoose to add username and password fields to the user schema, and also add some methods for authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);