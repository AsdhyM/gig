const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const { ServiceProviderModel } = require("../models/ServiceProviderModel");
const { upload } = require("../middleware/fileUpload");



// Register Service Provider API
const registerServiceProvider = async (request, response) => {
    try {
        const {name, email, password, tradeskill, experience, about, date, booking} = request.body;
        const image = request.files?.image?.[0];
        const documentation = request.files?.documentation || [];

        // Validate required fields
        if (!name || !email || !password || !tradeskill || !experience || !about) {
            return response.status(400).send("All information needs to be provided.");
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return response.status(400).send("Invalid email!");
        }

        // Validate password
        if(password.length < 8) {
            return response.status(400).send("Password must be at least 8 characters long!");
        }

        // Validate image and documentation
        if (!image || documentation.length === 0) {
            return response.status(400).send("Image and documentation files are required.");
        }

        // // Validating booking
        // if (booking) {
        //     const parsedBooking = typeof booking === "string" ? JSON.parse(booking) : booking;
        //     if(!parsedBooking.customerName || !parsedBooking.serviceDate) {
        //         return response.status(400).send("Customer name and service date needed for booking!.");
        //     }
        //     if(!validator.isDate(parsedBooking.serviceDate)) {
        //         return response.status(400).send("This booking date is not valid.");
        //     }
        // }

        // Securing password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"});
        const imageUrl = imageUpload.secure_url;

        // Upload documents to Cloudinary
        const documentData = [];
        if (documentation && documentation > 0) {
            for (const doc of documentation) {
                const documentUpload = await cloudinary.uploader.upload(doc.path, {resource_type:"auto"});
                documentData.push({
                    fileName : doc.originalname,
                    filePath: documentUpload.secure_url,
                    uploadedAt: new Date()
                });
            }
        }
        
        console.log("Uploaded files:", request.files);

        // Create service provider data
        const serviceProviderData = {
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
            image: imageUrl,
            tradeskill: request.body.tradeskill,
            documentation: documentData,
            experience: request.body.experience,
            about: request.body.about,
            availability: request.body.availability,
            date:date || Date.now(),
            booking: booking || {}
        }

        // Save to the database
        const newServiceProvider = new ServiceProviderModel(serviceProviderData);
        await newServiceProvider.save();

        // Generate JWT
        const token = jwt.sign({id:newServiceProvider._id}, process.env.JWT_SECRET);
        return response.json(token);

        // console.log("Service provider information is being saved:", ServiceProviderData);

        // return response.status(201).json({
        //     message: "Service provided added to the system. Admin team will verify your details.",
        //     data: ServiceProviderData
        // });

    } catch (error) {
        // Handle errors
        console.error(error);
        response.status(500).json({ error: "An error occurred, couldn't add service provider."});
    }
}


// Service provider login API
const loginServiceProvider = async (request, response) => {
    try {
        const {email, password} = request.body;
        const ServiceProvider = await ServiceProviderModel.findOne({email});

        if(!ServiceProvider) {
            return response.json({message: "Service Provider doesn't exist"});
        }

        const isMatch = await bcrypt.compare(password, ServiceProvider.password);

        if (isMatch) {
            const token = jwt.sign({id:ServiceProvider._id}, process.env.JWT_SECRET);
            response.json({token});
        } else {
            response.json({message: "Invalid credentials"})
        }
    } catch (error) {
        // Handle errors
        console.error("Error during Service provider Login:", error);
        response.status(500).json({ error: "An error occurred, couldn't login Service provider."});
    }
}

module.exports = {
    registerServiceProvider,
    loginServiceProvider
}