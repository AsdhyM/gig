const mongoose = require("mongoose");
const { ServiceProviderModel } = require("../models/ServiceProviderModel");
const { UserModel } = require("../models/UserModel");

require("dotenv").config();


// Function to connect our Database
async function dbConnect() {
    console.log(process.env.DATABASE_URL);
    let databaseUrl = process.env.DATABASE_URL || `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;

    await mongoose.connect(databaseUrl);
}

async function dbDisconnect() {
    // Disconnect from MongoDB
    await mongoose.connection.close();
}

async function dbDrop() {
    await mongoose.connection.db.dropDatabase();
}

module.exports = {
    dbConnect, dbDisconnect, dbDrop 
}