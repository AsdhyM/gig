const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    filename: function(request, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.round(Math.random() * 1E9))
        callback(null, file.originalname)
    }
})

const upload = multer({storage: storage})

module.exports = {
    upload
}