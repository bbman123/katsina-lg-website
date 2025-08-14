const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 10, featured } = req.query;

        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';

        const opportunities = await Opportunity.find(query)
            .populate('createdBy', 'name email')
            .sort({ featured: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Opportunity.countDocuments(query);

        res.json({
            success: true,
            count: opportunities.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: opportunities
        });
    } catch (error) {
        console.error('Get opportunities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        res.json({
            success: true,
            data: opportunity
        });
    } catch (error) {
        console.error('Get opportunity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create opportunity
// @route   POST /api/opportunities
// @access  Private (Editor/Admin)
const createOpportunity = async (req, res) => {
    try {
        const opportunityData = {
            ...req.body,
            createdBy: req.user.id
        };

        const opportunity = await Opportunity.create(opportunityData);

        await opportunity.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Opportunity created successfully',
            data: opportunity
        });
    } catch (error) {
        console.error('Create opportunity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Editor/Admin)
const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        ).populate('createdBy updatedBy', 'name email');

        res.json({
            success: true,
            message: 'Opportunity updated successfully',
            data: updatedOpportunity
        });
    } catch (error) {
        console.error('Update opportunity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Admin)
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        await Opportunity.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Opportunity deleted successfully'
        });
    } catch (error) {
        console.error('Delete opportunity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Apply to opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Public
const applyToOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: 'Opportunity not found'
            });
        }

        if (opportunity.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Opportunity is not currently active'
            });
        }

        if (new Date() > opportunity.deadline) {
            return res.status(400).json({
                success: false,
                message: 'Application deadline has passed'
            });
        }

        opportunity.applicants += 1;
        await opportunity.save();

        res.json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicants: opportunity.applicants
            }
        });
    } catch (error) {
        console.error('Apply to opportunity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    applyToOpportunity
};