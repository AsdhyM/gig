const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { User } = require("../models/UserModel");
const { upload } = require("../middleware/fileUpload");



// Register User
const registerUser = async (request, response) => {
    try {
        const {name, email, password, address, mobile} = request.body;
        const image = request.files?.image?.[0];

        // Validate required fields
        if (!name || !email || !password || !address || !mobile) {
            return response.status(400).send("All information needs to be provided.");
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return response.status(400).send("Invalid email!");
        }

        // Validate password
        if (password.length < 8) {
            return response.status(400).send("Password must be at least 8 characters long!");
        }

        // Validate mobile
        if (!validator.isMobilePhone(mobile, "any")) {
            return response.status(400).send("Enter a valid mobile number");
        }

        // Securing password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        let imageUrl = "../../docs/images/profileicon.png";
        if (image) {
            const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"});
            imageUrl = imageUpload.secure_url;
        }

        // Create user data
        const userData = {
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
            image: imageUrl,
            address: request.body.address,
            mobile: request.body.mobile
        }

        // Save to the database
        const newUser = new User(userData);
        await newUser.save();

        // Generate JWT
        const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET);
        return response.status(201).json({
            token,
            message: "You have been registered successfully"
        });


    } catch (error) {
        // Handle errors
        console.error("Error during user registration:", error);
        response.status(500).json({ error: "An error occurred, couldn't register user."});
    }
}


// Export the router for the app to use
module.exports = {
    registerUser
}