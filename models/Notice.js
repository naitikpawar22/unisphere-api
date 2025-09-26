const mongoose = require('mongoose');

// Define the schema for the Notice collection
const noticeSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Topic is required.'], // Field must not be empty
        trim: true // Remove whitespace from both ends
    },
    notice: {
        type: String,
        required: [true, 'Notice content is required.'],
        trim: true
    },
    tag: {
        type: String,
        required: [true, 'Tag is required.'],
        trim: true,
        enum: ['urgent', 'new', 'academic', 'general', 'event'] // Predefined list of allowed tags
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true
});

// Create and export the model
// Mongoose will create a collection named 'notices' (pluralized form of 'Notice')
module.exports = mongoose.model('Notice', noticeSchema);