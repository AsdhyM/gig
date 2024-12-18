require("dotenv").config();
const jwt = require("jsonwebtoken");


const jwtSecret = process.env.JWT_SECRET
const adminEmail = process.env.ADMIN_EMAIL


// Middleware for Admin authentication
async function authAdmin(request, response, next) {
    try {

        // Extracting the token from the Authorization header
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response.status(401).send("Access denied, token missing or invalid");
        }

        // Extracting the token from the header
        const token = authHeader.split(" ")[1];
        
        // Verifying the token
        const decodedToken = jwt.verify(token, jwtSecret);

        if (decodedToken.email !== adminEmail) {
            return response.status(401).send("Not Authorized, you need to Log in again.");
        }

        next();
        
    } catch (error) {
        console.error("Error in the authAdmin middleware:", error);

        // Checking if token as expired
        if (error.name === "TokenExpiredError") {
            return response.status(401).send("Session expired, please Log in again.");
        }

        // Checking if token as invalid
        if (error.name === "JsonWebTokenError") {
            return response.status(401).send("Not Authorized, invalid token.");
        }

        return response.status(500).json({ error: "An error occurred, couldn't add service provider."});
    }
}

module.exports = {
    authAdmin
}