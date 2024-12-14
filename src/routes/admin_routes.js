const express = require("express");
const router = express.Router();
const { addServiceProvider, adminLogin } = require("../controllers/adminController");
const { upload } = require("../middleware/fileUpload");




router.post('/addserviceprovider', upload.fields([
    { name: "image", maxCount: 1},
    { name: "documentation", maxCount: 5 }
], addServiceProvider), (request, response) => {
    console.log("Files:", request.files);
    response.status(201).json({
        message: "Files successfully uploaded",
        files: request.files
    });
    } 
);

router.post('/login', adminLogin);

module.exports = {
    router
}