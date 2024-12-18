require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { adminRouter } = require('./routes/admin_routes');
const { serviceProviderRouter } = require('./routes/serviceProvider_routes');
 
console.log("Admin Router:", adminRouter);
console.log("Service Provider Router:", serviceProviderRouter);
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



// localhost:3000/
app.get("/", (request, response) => {
    response.json({
        message:"welcome to GIG!"
    });
});

// Middleware - Admin routes
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


// Fallback for undefined routes
app.use((request, response) => {
    response.status(404).json({message: "Route not found"});
});


module.exports = {
    app
}