const express = require("express");
const { addServiceProvider, adminLogin } = require("../controllers/adminController");
const { upload } = require("../middleware/fileUpload");
const { authAdmin } = require("../middleware/authAdmin");

const adminRouter = express.Router();

// Add service provider Route
adminRouter.post(
    '/addserviceprovider', 
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
adminRouter.post('/login', adminLogin);

module.exports = {
    adminRouter
}