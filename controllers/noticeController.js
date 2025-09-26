const Notice = require('../models/Notice');
const mongoose = require('mongoose');

// --- GET ALL Notices ---
const getAllNotices = async (req, res) => {
    try {
        // Find all notices and sort them by creation date in descending order
        const notices = await Notice.find({}).sort({ createdAt: -1 });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ error: 'Server error: Could not fetch notices.' });
    }
};

// --- GET a SINGLE Notice by ID ---
const getNoticeById = async (req, res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID format.' });
    }

    try {
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ error: 'No such notice found.' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ error: 'Server error: Could not fetch the notice.' });
    }
};

// --- CREATE a new Notice ---
const createNotice = async (req, res) => {
    const { topic, notice, tag } = req.body;

    try {
        // Create a new document in the database
        const newNotice = await Notice.create({ topic, notice, tag });
        res.status(201).json(newNotice); // 201 status for successful creation
    } catch (error) {
        // Handle potential validation errors from the model
        res.status(400).json({ error: error.message });
    }
};

// --- UPDATE a Notice by ID ---
const updateNotice = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID format.' });
    }

    try {
        // Find the notice by ID and update it with the request body
        // { new: true } ensures the updated document is returned
        const updatedNotice = await Notice.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });

        if (!updatedNotice) {
            return res.status(404).json({ error: 'No such notice found to update.' });
        }
        res.status(200).json(updatedNotice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// --- DELETE a Notice by ID ---
const deleteNotice = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID format.' });
    }

    try {
        const deletedNotice = await Notice.findByIdAndDelete(id);

        if (!deletedNotice) {
            return res.status(404).json({ error: 'No such notice found to delete.' });
        }
        res.status(200).json({ message: 'Notice deleted successfully.', notice: deletedNotice });
    } catch (error) {
        res.status(500).json({ error: 'Server error: Could not delete the notice.' });
    }
};

// Export all the controller functions
module.exports = {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice
};