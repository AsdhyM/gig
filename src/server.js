require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const { adminRouter } = require('./routes/admin_routes');
const { serviceProviderRouter } = require('./routes/serviceProvider_routes');
const { userRouter } = require('./routes/user_routes');
 
console.log("Admin Router:", adminRouter);
console.log("Service Provider Router:", serviceProviderRouter);
console.log("User Router:", userRouter);
// Make a server instance
const app = express();

// Enables request.body to be JSON data
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: "*",
    optionsSucessStatus: 200
};
app.use(cors(corsOptions));
// Security headers
app.use(helmet());

// Serve static files from the images folder
// localhost:3000/images
//app.use('/images', express.static(path.join(__dirname, "images")));


// localhost:3000/
app.get('/', (request, response) => {
    response.json({
        message:"welcome to GIG!"
    });
});

// localhost:3000/admin
app.use('/admin', (request, response, next) => {
    console.log("Admin route accessed");
    next();
}, adminRouter);

// localhost:3000/serviceprovider
app.use('/serviceprovider', (request, response, next) => {
    console.log("Service provider route accessed");
    next();
}, serviceProviderRouter);

// localhost:3000/user
app.use('/user', (request, response, next) => {
    console.log("User route accessed");
    next();
}, userRouter);

// Fallback for undefined routes
app.use((request, response) => {
    response.status(404).json({message: "Route not found"});
});

// Global error handler
app.use((error, request, response, next) => {
    console.error("Error!:", error.message || error);
    response.status(error.status || 500).json({
        error: error.message || "Unexpected error"
    });
});


module.exports = {
    app
}