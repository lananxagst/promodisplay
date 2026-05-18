const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// GET /api/images - semua gambar untuk admin
router.get('/', async (req, res) => {
    try {
        const images = await Image.find().sort({ uploadDate: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/images/active - hanya gambar aktif untuk customer
router.get('/active', async (req, res) => {
    try {
        const images = await Image.find({ isActive: true }).sort({ uploadDate: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/images - upload gambar baru
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const image = new Image({
            name: req.file.originalname,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`
        });

        await image.save();
        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/images/:id/toggle - toggle aktif/nonaktif
router.patch('/:id/toggle', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        image.isActive = !image.isActive;
        await image.save();

        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/images/:id - hapus gambar
router.delete('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const filePath = path.join(__dirname, '..', image.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await image.deleteOne();
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
