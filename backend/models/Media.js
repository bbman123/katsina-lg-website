const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    type: {
        type: String,
        required: [true, 'Please specify media type'],
        enum: ['image', 'video', 'document']
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    cloudinaryId: {
        type: String
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'archived'],
        default: 'published'
    },
    views: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    featured: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for efficient queries
mediaSchema.index({ status: 1, type: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ featured: 1 });

module.exports = mongoose.model('Media', mediaSchema);