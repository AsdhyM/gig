const jwt = require("jsonwebtoken");

// Middleware for Admin authentication
const authAdmin = async (request, response) => {
    try {

        const {adminToken} = request.headers
        if (!adminToken) {
            return response.json({
                success: false,
                message: "Not Authorized to Login as Admin"
            });
        }

        const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);

        if (decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return response.json({
                success: false,
                message: "Not Authorized to Login as Admin"
            });
        }

        next();
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: "An error occurred, couldn't add service provider."});
    }
}

module.exports = {
    authAdmin
}