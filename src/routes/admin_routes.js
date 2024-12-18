const express = require("express");
const { addServiceProvider, adminLogin } = require("../controllers/adminController");
const { upload } = require("../middleware/fileUpload");
const { authAdmin } = require("../middleware/authAdmin");

const adminRouter = express.Router();

console.log("Admin routes are being initialized");

// Add service provider Route
adminRouter.post(
    '/addserviceprovider', (request, response, next) => {
        console.log("POST /admin/addserviceprovider called");
        next();
    },
    // Admin authentication middleware
    authAdmin, 
    // File upload middleware
    upload.fields([
        { name: "image", maxCount: 1},
        { name: "documentation", maxCount: 5 }
    ]), 
    // Controller for adding service provider
    addServiceProvider
);

// Admin Login Route
adminRouter.post('/login', (request, response, next) => {
    console.log("POST /admin/login called");
    next();
}, adminLogin);

module.exports = {
    adminRouter
}