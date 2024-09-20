const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required: true,
        min: 3,
        max: 20,
    },
    last_name: {
        type:String,
        required: true,
        min: 3,
        max: 20,
    },
    username: {
        type:String,
        required: true,
        min: 3,
        max: 20,
    },
    bio: {
        type:String,
        required: true,
        min: 0,
        max: 1000,
    },
    email: {
        type:String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type:String,
        required: true,
        min: 6,
        max: 255,
    }

}, {timestamps: true,});

module.exports = mongoose.model("User", UserSchema);