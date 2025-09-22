// routes/heroSlides.js
const express = require('express');
const router = express.Router();
const HeroSlide = require('../models/HeroSlide');
const cloudinary = require('../config/cloudinary'); // setup Cloudinary SDK
const upload = require('../middleware/multer'); // for file uploads

// GET all hero slides
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new hero slide
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image; // fallback if no file

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'hero-slides'
      });
      imageUrl = result.secure_url;
    }

    const slide = new HeroSlide({
      ...req.body,
      image: imageUrl,
      stats: JSON.parse(req.body.stats || '{}')
    });

    await slide.save();
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update slide
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'hero-slides'
      });
      updates.image = result.secure_url;
    }

    if (req.body.stats) {
      updates.stats = JSON.parse(req.body.stats);
    }

    const slide = await HeroSlide.findByIdAndUpdate(id, updates, { new: true });
    if (!slide) return res.status(404).json({ error: 'Slide not found' });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE slide
router.delete('/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide not found' });
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;