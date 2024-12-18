require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const { ServiceProviderModel } = require('../models/ServiceProviderModel');

const jwtSecret = process.env.JWT_SECRET;



// API for admin Login
const adminLogin = async (request, response) => {
    try {

        const {email, password} = request.body

        // Validate request
        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }

        // Verify admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });

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
    try {
        const {name, email, image, tradeskill, documentation, experience, about} = request.body;

        // Validate required fields
        if (!name || !email || !image|| !tradeskill || !documentation || !experience || !about) {
            return response.status(400).json({
                message: "All required fields must be provided."
            });
        }

        // Save the service provider in the database
        const newServiceProvider = new ServiceProviderModel({
            name,
            email,
            image,
            tradeskill,
            documentation,
            experience,
            about,
            date: Date.now(),
            availability: "Available"
        });

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
    
