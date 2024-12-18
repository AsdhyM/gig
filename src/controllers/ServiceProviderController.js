const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const { ServiceProviderModel } = require("../models/ServiceProviderModel");



const router = express.Router();

// Register Service Provider
const registerServiceProvider = async (request, response) => {
    try {
        const {name, email, password, tradeskill, experience, about} = request.body;
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

        // Upload image
        const imageUpload = await cloudinary.uploader.upload(image.path, {resource_type:"image"});
        const imageUrl = imageUpload.secure_url;

        // Upload documents
        const documentUrls = [];
        for (const file of documentation) {
            const documentUpload = await cloudinary.uploader.upload(file.path, {resource_type:"auto"});
            documentUrls.push(documentUpload.secure_url);
        }
        console.log("Uploaded files:", request.files);

        const ServiceProviderData = {
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
            image: imageUrl,
            tradeSkill: request.body.tradeSkill,
            documentation: documentUrls,
            experience: request.body.experience,
            about: request.body.about,
            availability: request.body.availability,
            date:date || Date.now(),
            booking: booking || {}
        }

        const newServiceProvider = new ServiceProviderModel(ServiceProviderData);
        await newServiceProvider.save();

        const token = jwt.register({id:serviceProvider._id}, process.env.JWT_SECRET);
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

module.exports = {
    registerServiceProvider
}