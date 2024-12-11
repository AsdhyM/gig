const mongoose = require("mongoose");

// Service Provider Schema
const ServiceProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minLength: 3,
        trim: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    tradeSkill: {
        type: String,
        required: true,
    },
    documentation: [
        {
            fileName: { type: String, required: true },
            filePath: { type: String, required: true },
            uploadedAt: {type: Date, default: Date.now },
        },
    ], 
    experience: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    booking: {
        type: Object,
        default: {}
    }
},{minimize:false})

// Model based on the schema
const ServiceProviderModel = mongoose.model("ServiceProvider", ServiceProviderSchema);

// Exporting the model
module.exports = {
    ServiceProviderModel
}