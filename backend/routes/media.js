const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { auth, editorOrAdmin } = require('../middleware/auth');
const Media = require('../models/Media');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images, videos, and documents
        if (file.mimetype.startsWith('image/') ||
            file.mimetype.startsWith('video/') ||
            file.mimetype === 'application/pdf' ||
            file.mimetype.includes('document')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// @desc    Get all media
// @route   GET /api/media
// @access  Public
const getMedia = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 10 } = req.query;

        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        const media = await Media.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Media.countDocuments(query);

        res.json({
            success: true,
            count: media.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: media
        });
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Upload media
// @route   POST /api/media
// @access  Private (Editor/Admin)
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const { title, description, type } = req.body;

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'katsina-lg',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        // Save to database
        const media = await Media.create({
            title,
            description,
            type: type || (req.file.mimetype.startsWith('image/') ? 'image' :
                req.file.mimetype.startsWith('video/') ? 'video' : 'document'),
            fileUrl: result.secure_url,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            cloudinaryId: result.public_id,
            createdBy: req.user.id
        });

        await media.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Media uploaded successfully',
            data: media
        });
    } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private (Editor/Admin)
const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);

        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Media not found'
            });
        }

        // Delete from Cloudinary
        if (media.cloudinaryId) {
            await cloudinary.uploader.destroy(media.cloudinaryId);
        }

        // Delete from database
        await Media.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Media deleted successfully'
        });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Routes
router.get('/', getMedia);
router.post('/', auth, editorOrAdmin, upload.single('file'), uploadMedia);
router.delete('/:id', auth, editorOrAdmin, deleteMedia);

module.exports = router;