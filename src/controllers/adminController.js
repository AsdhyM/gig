const express = require("express");




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
        if(!name || !email || !password) {
            return response.status(400).json({ message: "Name, email, and password are required!." });

        }

        if (!image || documentation.lenght === 0) {
            return response.status(400).json({message: "Image and documentation files are required."});
        }

        
    } catch (error) {
        // Handle errors
        console.error(error);
        response.status(500).json({ message: "An error occurred, couldn't add service provider." });
    }
};

module.exports = {
    addServiceProvider,
}
    
