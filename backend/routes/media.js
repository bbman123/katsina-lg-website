const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media'); // Add this import
const mongoose = require('mongoose');

// Add auth middleware directly here
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload new media
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Determine resource type based on file type
    let resourceType = 'image';
    let folder = 'media/images';
    
    if (req.file.mimetype.startsWith('video/')) {
      resourceType = 'video';
      folder = 'media/videos';
    } else if (!req.file.mimetype.startsWith('image/')) {
      resourceType = 'raw';
      folder = 'media/documents';
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: folder,
          public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`,
          transformation: resourceType === 'image' ? [
            { quality: 'auto', fetch_format: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Create and save media record to MongoDB
    const mediaItem = new Media({
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      type: req.body.type || resourceType,
      category: req.body.category || 'General',
      status: req.body.status || 'published',
      featured: req.body.featured === 'true',
      fileUrl: uploadResult.secure_url,
      thumbnail: resourceType === 'video' 
        ? uploadResult.thumbnail_url 
        : uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      format: uploadResult.format,
      size: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      tags: req.body.category ? [req.body.category.toLowerCase()] : [],
      uploadedBy: req.user.id // From auth middleware
    });

    // Save to MongoDB
    const savedMedia = await mediaItem.save();

    res.json({
      success: true,
      message: 'Media uploaded successfully',
      data: savedMedia
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // If there was an error after uploading to Cloudinary, try to delete it
    if (error.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(error.cloudinaryId);
      } catch (deleteError) {
        console.error('Failed to delete from Cloudinary:', deleteError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload media',
      error: error.message 
    });
  }
});

// Get all media items
router.get('/', async (req, res) => {
  try {
    const { category, status, featured, search, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';
    
    // If search term provided, use text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch from MongoDB
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('uploadedBy', 'name email');
    
    const total = await Media.countDocuments(query);
    
    res.json({
      success: true,
      data: media,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch media',
      error: error.message 
    });
  }
});

// Get media by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const media = await Media.findOne({ slug: req.params.slug });
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    res.json(media);
  } catch (error) {
    console.error('Error fetching media by slug:', error);
    res.status(500).json({ message: 'Error fetching media', error: error.message });
  }
});

// Get single media item
router.get('/:id', async (req, res) => {
  try {
    // Check if it's a valid MongoDB ID
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const media = await Media.findById(req.params.id);
      if (media) return res.json(media);
    }
    
    // If not found by ID, try slug as fallback
    const media = await Media.findOne({ slug: req.params.id });
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Error fetching media', error: error.message });
  }
});

// Update media item
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, status, featured, tags } = req.body;
    
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    // Update fields
    if (title) media.title = title;
    if (description !== undefined) media.description = description;
    if (category) media.category = category;
    if (status) media.status = status;
    if (featured !== undefined) media.featured = featured;
    if (tags) media.tags = tags;
    
    const updatedMedia = await media.save();
    
    res.json({
      success: true,
      message: 'Media updated successfully',
      data: updatedMedia
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update media',
      error: error.message 
    });
  }
});

// Delete media item
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(media.cloudinaryId);
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
    }
    
    // Delete from MongoDB
    await media.deleteOne();
    
    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete media',
      error: error.message 
    });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update download count',
      error: error.message 
    });
  }
});

// Add this new route for tracking views
router.post('/:id/view', async (req, res) => {
  try {
    const mediaId = req.params.id;
    
    // Get client IP (considering proxy)
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               req.ip;
    
    const userAgent = req.headers['user-agent'];
    
    // Find media item
    const media = await Media.findById(mediaId);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    // Check if this IP has viewed in the last hour (prevent spam)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentView = media.viewDetails.find(view => 
      view.ip === ip && new Date(view.viewedAt) > oneHourAgo
    );
    
    if (!recentView) {
      // Add view detail
      media.viewDetails.push({
        viewedAt: new Date(),
        ip: ip,
        userAgent: userAgent,
        userId: req.user ? req.user.id : null
      });
      
      // Increment total views
      media.views += 1;
      
      // Increment weekly views
      media.weeklyViews += 1;
      
      // Keep only last 1000 view details to prevent document size issues
      if (media.viewDetails.length > 1000) {
        media.viewDetails = media.viewDetails.slice(-1000);
      }
      
      await media.save();
    }
    
    res.json({
      success: true,
      views: media.views,
      message: 'View tracked successfully'
    });
    
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track view',
      error: error.message
    });
  }
});

// Add route to get trending media (top 5 most viewed this week)
router.get('/trending/week', async (req, res) => {
  try {
    const trending = await Media.find({
      status: 'published',
      weeklyViews: { $gt: 0 }
    })
    .sort({ weeklyViews: -1 })
    .limit(5)
    .select('title slug thumbnail fileUrl type category views weeklyViews createdAt');
    
    res.json({
      success: true,
      data: trending
    });
    
  } catch (error) {
    console.error('Error fetching trending media:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending media',
      error: error.message
    });
  }
});

module.exports = router;