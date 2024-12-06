const express = require("express");

// Make an instance of the Express system to configure it
const app = express();

// GET localhost:3000/
app.get("/", (request, response) => {
    response.json({
        message:"Hello World!"
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});