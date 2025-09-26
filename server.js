// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

// Import routes
const noticeRoutes = require('./routes/notices');

// Initialize Express app
const app = express();

// --- Middleware ---
app.use(cors()); // Allow all origins; can restrict to specific frontend later
app.use(express.json()); // Parse JSON bodies

// --- Routes ---
app.use('/api/notices', noticeRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Notice Management API!');
});

// --- MongoDB Connection ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined.");
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('MongoDB connection error:', err.message);
});
