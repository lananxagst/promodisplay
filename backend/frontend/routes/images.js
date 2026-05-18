const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'promodisplay', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

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

        const result = await uploadToCloudinary(req.file.buffer);

        const image = new Image({
            name: req.file.originalname,
            cloudinaryId: result.public_id,
            path: result.secure_url
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

// DELETE /api/images/:id - hapus gambar dari Cloudinary & MongoDB
router.delete('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        if (image.cloudinaryId) {
            await cloudinary.uploader.destroy(image.cloudinaryId).catch((err) => {
                console.warn('Cloudinary destroy skipped:', err.message);
            });
        }

        await image.deleteOne();
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
