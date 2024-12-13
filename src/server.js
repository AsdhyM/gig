const express = require("express");
const cors = require("cors");

const { adminRouter } = require("./routes/adminRoute");


// Make a server instance
const app = express();

// Enables request.body to be JSON data
app.use(express.json());

// CORS configuration
let corsOptions = {
    origin: [],
    optionsSucessStatus: 200
};
app.use(cors(corsOptions));




// localhost:3000/
app.get("/", (request, response) => {
    response.json({
        message:"welcome to GIG!"
    });
});

// Middleware - Admin routes
// localhost:3000/admin
app.use('/admin', adminRouter);

// Fallback for undefined routes
app.use((request, response, next) => {
    response.status(404).json({message: "Route not found"});
});


module.exports = {
    app
}