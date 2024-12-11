const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    filename: function(request, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.round(Math.random() * 1E9))
        callback(null, file.originalname)
    }
});

const fileFilter = function(request, file, callback) {
    const approvedTypes = ["pdf", "jpeg", "png"];
    if (approvedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Only PDF, JPEG, and PNG files are accepted."))
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

module.exports = {
    upload
}