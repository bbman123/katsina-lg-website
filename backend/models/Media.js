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
  // Add detailed view tracking
  viewDetails: [{
    viewedAt: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  }],
  // Track weekly views for trending calculation
  weeklyViews: {
    type: Number,
    default: 0
  },
  lastViewReset: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  slug: {
    type: String,
    unique: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for search
mediaSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Add a pre-save hook to generate slug
mediaSchema.pre('save', async function(next) {
  if (this.isModified('title') || this.isNew) {
    // Generate base slug from title
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .substring(0, 100); // Limit length
    
    // Ensure uniqueness
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await this.constructor.findOne({ 
        slug: slug,
        _id: { $ne: this._id } // Exclude current document
      });
      
      if (!existing) break;
      
      // Add counter if duplicate found
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Media', mediaSchema);