const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { UserModel } = require("../models/UserModel");
const { upload } = require("../middleware/fileUpload");
const { json } = require("express/lib/response");



// Register User API
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
        const newUser = new UserModel(userData);
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
        return response.status(500).json({ 
            message: "An error occurred, couldn't register user.",
            error: error.message
        });
    }
}

// User login API
const loginUser = async (request, response) => {
    try {
        const {email, password} = request.body;
        const user = await UserModel.findOne({email});

        if(!user) {
            return response.json({message: "User doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            return response.json({token});
        } else {
            return response.json({message: "Invalid credentials"})
        }
    } catch (error) {
        // Handle errors
        console.error("Error during user Login:", error);
        return response.status(500).json({ error: "An error occurred, couldn't login user."});
    }
}

// get user profile API
const getProfile = async (request, response) => {
    try {
        const { userId } = request.body;
        // Validate if userId exist in the request
        if (!userId) {
            return response.status(400).json({
                message: "User ID is missing!"
            });
        }
        // Find user by ID
        const userData = await UserModel.findById(userId).select('-password');
        // Validate if user exists
        if (!userData) {
            return response.status(404).json({
                message: "User not found!"
            });
        }
        return response.status(200).json({
            message: "User profile retrieved successfully",
            userData
        });

    } catch (error) {
        console.log("Error while getProfile:", error);
        return response.status(500).json({
            message: "Couldn't get user profile",
            error: error.message
        });
    }
}

// update user profile API
const updateProfile = async (request, response) => {
    try {
        const {userId, name, address, mobile} = request.body;
        const image = request.file?.image?.[0];

        // Validate required fields
        if (!name || !address || !mobile){
            return response.status(400).json({
                message: "Missing details"
            });
        }

        // Validate mobile
        if (!validator.isMobilePhone(mobile, "any")) {
            return response.status(400).send("Enter a valid mobile number");
        }

        // Update fields
        const updateData = {name, address, mobile};

        // Upload image if provided
        if (image) {
            const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"});
            updateData.image = imageUpload.secure_url;
        }

        // Update user profile in the database
        await UserModel.findByIdAndUpdate(userId, updateData);

        return response.status(200).json({
            message: "User profile updated successfully"
        });

    } catch (error) {
        console.log("Error while updateProfile:", error);
        return response.status(500).json({
            message: "Couldn't update user profile",
            error: error.message
        });
    }
}



// Export the router for the app to use
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
}