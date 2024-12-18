const express = require("express");
const { registerServiceProvider } = require("../controllers/ServiceProviderController");
const { authAdmin } = require("../middleware/authAdmin");
const { upload } = require("../middleware/fileUpload");

const serviceProviderRouter = express.Router();


serviceProviderRouter.post(
    '/register', 
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