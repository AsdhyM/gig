const multer = require("multer");

const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        const uploadPath = path.join(__dirname, "../../docs/uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true});
        } else {
            console.log("File does not exist.");
        }
        callback(null, uploadPath);
    },
    filename: (request, file, callback) => {
        // Giving uploaded files unique names
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Getting file extension
        const extension = file.originalname.split('.').pop();
        callback(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
    },
});

const upload = multer ({
    storage,
    // Maximum of 5MG file size
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (request, file, callback) => {
        const approvedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (approvedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Only PDF, JPEG, and PNG files are accepted."))
        }
    },
});


module.exports = {
    upload
}