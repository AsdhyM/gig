const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        default: "http://localhost:3000/images/profilecon.png"
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        default: "0000000000",
        match: [/^04\d{8}$/, "Mobile number must be 10 digits"],
    },
})

// Model based on the schema
const User = mongoose.model("User", UserSchema);

// Exporting the model
module.exports = {
    User
}