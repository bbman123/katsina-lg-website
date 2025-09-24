const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    default: 'image'
  },
  category: {
    type: String,
    default: 'General'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true,
    unique: true
  },
  format: String,
  size: Number,
  width: Number,
  height: Number,
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
mediaSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Media', mediaSchema);