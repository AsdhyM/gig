const express = require("express");
const { ServiceProviderModel } = require("../models/ServiceProviderModel");

const router = express.Router();

const addServiceProvider = async (request, response) => {
    try {
        console.log("Request body:", request.body);
        console.log("Files uploaded:", request.files);


        return response.status(201).json("Service provider added.");
    } catch (error) {
        console.error("Couldn't add service provider:", error);
        return response.status(500).json("Failed to add service provider.");
    }
}