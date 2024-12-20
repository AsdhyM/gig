const express = require("express");
const { registerUser } = require("../controllers/userController");
const { upload } = require("../middleware/fileUpload");

const userRouter = express.Router();

console.log("User routes are being initialized");

userRouter.post(
    '/register', (request, response, next) => {
        console.log("POST /user/register called");
        next();
    },
    // File upload middleware
    upload.fields([{ name: "image", maxCount: 1}]), 
    // Debugging file uploads
    async (request, response, next) => {
        console.log("Image uploaded:", request.files);
        // Pass control to the controller
        next();
    },
    // Register service provider logic 
    registerUser
);

module.exports = {
    userRouter
}