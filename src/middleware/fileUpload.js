const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "../../docs/uploads");
    },
    filename: function(request, file, callback) {
        // Giving uploaded files unique names
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Getting file extension
        const extension = file.originalname.split('.').pop();
        callback(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
});

const upload = multer ({
    storage,
    // Maximum of 5MG file size
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (request, file, callback) => {
        const approvedTypes = ["applicatrion/pdf", "image/jpeg", "image/png"];
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