const express = require("express");
const app = express();

// localhost:3000/
app.get("/", (request, response) => {
    response.json({
        message:"Hello world"
    });
});

module.exports = {
    app
}