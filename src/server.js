const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

let corsOptions = {
    origin: [],
    optionsSucessStatus: 200
};
app.use(cors(corsOptions));

// localhost:3000/
app.get("/", (request, response) => {
    response.json({
        message:"Hello world!"
    });
});

module.exports = {
    app
}