const Opportunity = require('../models/Opportunity');
const Media = require('../models/Media');

// @desc    Get public data for frontend polling
// @route   GET /api/public-data
// @access  Public
const getPublicData = async (req, res) => {
    try {
        // Get active opportunities
        const opportunities = await Opportunity.find({
            status: 'active',
            deadline: { $gte: new Date() }
        })
            .select('title description category deadline amount duration applicants requirements')
            .sort({ featured: -1, createdAt: -1 })
            .limit(20);

        // Get published media
        const media = await Media.find({
            status: 'published'
        })
            .select('title description type fileUrl fileName views tags')
            .sort({ featured: -1, createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: {
                opportunities,
                media
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Get public data error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get statistics for dashboard
// @route   GET /api/public-stats
// @access  Public
const getPublicStats = async (req, res) => {
    try {
        const [
            totalOpportunities,
            activeOpportunities,
            totalMedia,
            totalApplicants
        ] = await Promise.all([
            Opportunity.countDocuments(),
            Opportunity.countDocuments({ status: 'active' }),
            Media.countDocuments({ status: 'published' }),
            Opportunity.aggregate([
                { $group: { _id: null, total: { $sum: '$applicants' } } }
            ])
        ]);

        const stats = {
            totalOpportunities,
            activeOpportunities,
            totalMedia,
            totalApplicants: totalApplicants[0]?.total || 0
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get public stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getPublicData,
    getPublicStats
};