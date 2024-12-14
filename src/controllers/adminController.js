const express = require("express");
const validator = require("validator")
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2


// API for adding new service provider
const addServiceProvider = async (request, response) => {

    try {
        const { 
            name, 
            email, 
            password, 
            tradeSkill,  
            experience, 
            about, 
            availability, 
            date, 
            booking 
        } = request.body;

        const image = request.files?.image?.[0];
        const documentation = request.files?.documentation || [];

        // Validate required fields
        if(!name || !email || !password || !tradeSkill || !experience || !about) {
            return response.status(400).send("Missing details are required!.");
        }

        // Validating email
        if (!validator.isEmail(email)) {
            return response.status(400).send("Invalid email!.");
        }

        // Validating password
        if (password.length < 8) {
            return response.status(400).send("Password must be at least 8 characters.");
        }
        
        // Validating image and documentation
        if (!image || documentation.length === 0) {
            return response.status(400).send("Image and documentation files are required.");
        }

        // Validating booking
        if (booking) {
            if(!booking.customerName || !booking.serviceDate) {
                return response.status(400).send("Customer name and service date needed for booking!.");
            }
            if(!validator.isDate(booking.serviceDate)) {
                return response.status(400).send("This booking date is not valid.");
            }
        }

        // Securing password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});
        const imageUrl = imageUpload.secure_url

        // Upload documents
        const documentUrls = [];
        for (const documents of documentation) {
            const documentUpload = await cloudinary.uploader.upload(documentFile.path, {resource_type:"auto"});
            documentUrls.push(documentUpload.secure_url);
        }

        const ServiceProviderData = {
            name,
            email,
            password:hashedPassword,
            image:imageUrl,
            tradeSkill,
            documentation:documentUrls,
            experience,
            about,
            availability,
            date:Date.now(),
            booking: booking || {}
        }

        console.log("Service provider information is being saved:", ServiceProviderData);

        return response.status(201).json({
            message: "Service provided added to the system.",
            data: ServiceProviderData
        });

    } catch (error) {
        // Handle errors
        console.error(error);
        response.status(500).json({ error: "An error occurred, couldn't add service provider."});
    }
};

module.exports = {
    addServiceProvider,
}
    
