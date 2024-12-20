require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const { ServiceProvider } = require('../models/ServiceProviderModel');

const jwtSecret = process.env.JWT_SECRET;



// API for admin Login
const adminLogin = async (request, response) => {
    console.log("AdminLogin invoked with data:", request.body);
    try {

        const {email, password} = request.body

        // Validate request
        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }

        // Verify admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: "3h" });

            return response.status(200).send({token});

        } else {
            return response.status(401).send("Invalid credentials");
        }

    } catch (error) {
        console.error("Error in adminLogin:", error);
        return response.status(500).json({ 
            message: "An error occurred, couldn't add service provider.",
            error: error.message
        });
    }
};

// API to add service provider
const addServiceProvider = async (request, response) => {
    console.log("addServiceProvider invoked with data:", request.body);
    try {
        const {name, email, password, tradeskill, experience, about} = request.body;
        const image = request.files?.image?.[0];
        const documentation = request.files?.documentation;
        // Validate required fields
        if (!name || !email || !password || !image|| !tradeskill || !documentation || !experience || !about) {
            return response.status(400).json({
                message: "All required fields must be provided."
            });
        }

        // Securing password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"});
        const imageUrl = imageUpload.secure_url;

        // Initialize document data array
        const documentData = [];

        // Upload documents to Cloudinary
        const documentUrls = [];
        for (const file of documentation) {
            const documentUpload = await cloudinary.uploader.upload(file.path, {resource_type:"auto"});
            documentData.push({
                fileName: file.originalname,
                filePath: documentUpload.secure_url,
                uploadedAt: new Date()
            });
        }

        // Save the service provider in the database
        const serviceProviderData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            tradeskill,
            documentation: documentData,
            experience,
            about,
            date: Date.now(),
            availability: "Available"
        };

        const newServiceProvider = new ServiceProvider(serviceProviderData);
        await newServiceProvider.save();

        return response.status(201).json({
            message: "Service provider approved and added succesfully.",
            data: newServiceProvider
        });

    } catch (error) {
        console.error("Can't add service provider!:", error);
        return response.status(500).json({
            message: "There's something wrong, couldn't add service provider!",
            error: error.message
        });
    }
}

module.exports = {
    adminLogin,
    addServiceProvider
}
    
