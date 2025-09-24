const express = require('express');
const router = express.Router();

// Import your models (adjust paths as needed)
// const Media = require('../models/Media');
// const User = require('../models/User');
// const HeroSlide = require('../models/HeroSlide');

// For now, let's create a simple test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Debug route is working',
    timestamp: new Date().toISOString()
  });
});

// Get all collections in database
router.get('/collections', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({
      success: true,
      count: collections.length,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// View media collection
router.get('/media', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collection = mongoose.connection.db.collection('media');
    const media = await collection.find({}).toArray();
    res.json({
      success: true,
      count: media.length,
      data: media
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// View users collection (exclude passwords)
router.get('/users', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collection = mongoose.connection.db.collection('users');
    const users = await collection.find({}, { projection: { password: 0 } }).toArray();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// View hero slides collection
router.get('/hero-slides', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collection = mongoose.connection.db.collection('heroslides');
    const slides = await collection.find({}).toArray();
    res.json({
      success: true,
      count: slides.length,
      data: slides
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Database stats
router.get('/stats', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const stats = {
      connected: mongoose.connection.readyState === 1,
      database: db.databaseName,
      collections: {}
    };

    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      stats.collections[col.name] = count;
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;