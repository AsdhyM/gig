const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;



// API for admin Login
const adminLogin = async (request, response) => {
    try {

        const {email, password} = request.body

        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });

            return response.status(200).send({token});

        } else {
            return response.status(401).send("Invalid credentials");
        }

    } catch (error) {
        console.error("Error in adminLogin:", error);
        return response.status(500).json({ error: "An error occurred, couldn't add service provider."});
    }
};

module.exports = {
    adminLogin
}
    
