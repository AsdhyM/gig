const express = require("express");
const router = express.Router();
const { addServiceProvider } = require("../controllers/adminController");
const { upload } = require("../middleware/fileUpload");




router.post('/addserviceprovider', 
    upload.fields[(
        { name: "image", maxCount: 1},
        { name: "documentation", maxCount: 5 }
    )], 
    addServiceProvider
);

module.exports = {
    router
}