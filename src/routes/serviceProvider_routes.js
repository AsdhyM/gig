const express = require("express");
const { registerServiceProvider } = require("../controllers/ServiceProviderController");
const { authAdmin } = require("../middleware/authAdmin");
const { upload } = require("../middleware/fileUpload");

const serviceProviderRouter = express.Router();

console.log("Service provider routes are being initialized");

serviceProviderRouter.post(
    '/register', (request, response, next) => {
        console.log("POST /serviceprovider/register called");
        next();
    },
    // Admin authentication middleware
    authAdmin, 
    // File upload middleware
    upload.fields([
        { name: "image", maxCount: 1},
        { name: "documentation", maxCount: 5 }
    ]), 
    // Debugging file uploads
    async (request, response, next) => {
    console.log("Files uploaded:", request.files);
    // Pass control to the controller
    next();
    response.status(201).json({
        message: "Files successfully uploaded",
        files: request.files
    });
    },
    // Register service provider logic 
    registerServiceProvider
);

module.exports = {
    serviceProviderRouter
}