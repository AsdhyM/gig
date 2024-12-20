require("dotenv").config();
const jwt = require("jsonwebtoken");


// Middleware for Admin authentication
async function authServiceProvider(request, response, next) {
    try {

        // Extracting the token from the Authorization header
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("Authorization header missing or invalid", authHeader);
            return response.status(401).send("Access denied, Login again");
        }

        // Extracting the token from the header
        const token = authHeader.split(" ")[1];
        
        // Verifying the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to the request object
        request.body.serviceProviderId = decodedToken.id

        next();
        
    } catch (error) {
        console.error("Error in the authServiceProvider middleware:", error);

        // Checking if token as expired
        if (error.name === "TokenExpiredError") {
            return response.status(401).send("Session expired, please Log in again.");
        }

        // Checking if token as invalid
        if (error.name === "JsonWebTokenError") {
            return response.status(401).send("Not Authorized, invalid token.");
        }

        return response.json({
            message: "An error ocurred during authentication",
            error: error.message
        });
    }
}

module.exports = {
    authServiceProvider
}