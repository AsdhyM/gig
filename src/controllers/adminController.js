const express = require("express");


// API for adding new service provider
const addServiceProvider = async (request, response) => {

    try {
        const { 
            name, 
            email, 
            password, 
            image, 
            tradeSkill, 
            documentation, 
            experience, 
            about, 
            availability, 
            date, 
            booking 
        } = request.body;

        // Validate required fields
        if(!name || !email || !password) {
            return response.status(400).json({ message: "Name, email, and password are required!." });

        }
    } catch (error) {
        // Handle errors
        console.error(error);
        response.status(500).json({ message: "An error occurred, couldn't add service provider." });
    }
};

module.exports = {
    addServiceProvider
}
    
