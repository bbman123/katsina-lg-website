const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Grant', 'Training', 'Loan', 'Employment', 'Other']
    },
    amount: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    deadline: {
        type: Date,
        required: [true, 'Please provide a deadline'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Deadline must be in the future'
        }
    },
    requirements: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'coming_soon', 'expired'],
        default: 'active'
    },
    applicants: {
        type: Number,
        default: 0,
        min: 0
    },
    maxApplicants: {
        type: Number
    },
    applicationUrl: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
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
opportunitySchema.index({ status: 1, deadline: 1 });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ featured: 1 });

// Auto-expire opportunities
opportunitySchema.pre('save', function(next) {
    if (this.deadline < new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    next();
});

module.exports = mongoose.model('Opportunity', opportunitySchema);