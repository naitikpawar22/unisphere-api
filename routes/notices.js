// routes/notices.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// --- Notice Schema ---
const noticeSchema = new mongoose.Schema({
    Topic: { type: String, required: true },
    Notice: { type: String, required: true },
    Tag: { type: String, default: 'New' },
    Link: { type: String, default: '' },
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

// --- CRUD Routes ---

// GET all notices
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        return res.status(200).json(notices);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET single notice by ID
router.get('/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });
        return res.status(200).json(notice);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST - create a new notice
router.post('/', async (req, res) => {
    const { Topic, Notice: noticeText, Tag, Link } = req.body;

    if (!Topic || !noticeText) {
        return res.status(400).json({ message: 'Topic and Notice are required.' });
    }

    try {
        const newNotice = new Notice({ Topic, Notice: noticeText, Tag, Link });
        const savedNotice = await newNotice.save();
        return res.status(201).json({ message: 'Notice created successfully', notice: savedNotice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT - update an existing notice
router.put('/:id', async (req, res) => {
    const { Topic, Notice: noticeText, Tag, Link } = req.body;

    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,
            { Topic, Notice: noticeText, Tag, Link },
            { new: true, runValidators: true }
        );

        if (!updatedNotice) return res.status(404).json({ message: 'Notice not found' });

        return res.status(200).json({ message: 'Notice updated successfully', notice: updatedNotice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE - delete a notice
router.delete('/:id', async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        if (!deletedNotice) return res.status(404).json({ message: 'Notice not found' });
        return res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
