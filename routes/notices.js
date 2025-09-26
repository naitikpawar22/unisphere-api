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
        res.json(notices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single notice by ID
router.get('/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });
        res.json(notice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST - create a new notice
router.post('/', async (req, res) => {
    const { Topic, Notice: NoticeText, Tag, Link } = req.body;

    if (!Topic || !NoticeText) {
        return res.status(400).json({ message: 'Topic and Notice are required.' });
    }

    try {
        const newNotice = new Notice({ Topic, Notice: NoticeText, Tag, Link });
        const savedNotice = await newNotice.save();
        res.status(201).json({ message: 'Notice created successfully', notice: savedNotice });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT - update an existing notice
router.put('/:id', async (req, res) => {
    const { Topic, Notice: NoticeText, Tag, Link } = req.body;

    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,
            { Topic, Notice: NoticeText, Tag, Link },
            { new: true, runValidators: true }
        );
        if (!updatedNotice) return res.status(404).json({ message: 'Notice not found' });
        res.json({ message: 'Notice updated successfully', notice: updatedNotice });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE - delete a notice
router.delete('/:id', async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        if (!deletedNotice) return res.status(404).json({ message: 'Notice not found' });
        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
