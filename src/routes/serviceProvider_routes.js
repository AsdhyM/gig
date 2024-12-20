const express = require("express");
const { registerServiceProvider, loginServiceProvider, getServiceProviderProfile, updateServiceProviderProfile } = require("../controllers/ServiceProviderController");
const { authAdmin } = require("../middleware/authAdmin");
const { upload } = require("../middleware/fileUpload");
const { authServiceProvider } = require("../middleware/authServiceProvider");


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

serviceProviderRouter.post('/login', loginServiceProvider)

serviceProviderRouter.get('/getprofile', authServiceProvider, getServiceProviderProfile)

serviceProviderRouter.post(
    '/updateprofile', 
    authAdmin,
    upload.fields([
        { name: "image", maxCount: 1},
        { name: "documentation", maxCount: 5 }
    ]),
     // Debugging file uploads
     async (request, response, next) => {
        console.log("request files:", request.files);
        console.log("request body:", request.body);
        // Pass control to the controller
        next();
        response.status(201).json({
            message: "Files successfully uploaded",
            files: request.files
        });
        },
    updateServiceProviderProfile
)

module.exports = {
    serviceProviderRouter
}