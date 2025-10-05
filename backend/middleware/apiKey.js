const validateApiKey = (req, res, next) => {
    // Get API key from header or query parameter
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const validApiKey = process.env.API_KEY;
    
    // List of endpoints that don't require API key
    // Use req.path for the path check
    const publicPaths = [
        '/health',        // Health check
        '/test',          // Test endpoint
        '/auth/login',    // Login endpoint
    ];
    
    // Check if current path is public (remove /api prefix for comparison)
    const pathWithoutApi = req.path.replace(/^\/api/, '');
    const isPublicPath = publicPaths.some(path => 
        pathWithoutApi === path || pathWithoutApi.startsWith(path + '/')
    );
    
    if (isPublicPath) {
        return next();
    }
    
    // Validate API key
    if (!validApiKey) {
        console.error('⚠️ API_KEY not configured in .env file!');
        return res.status(500).json({
            success: false,
            message: 'Server configuration error'
        });
    }
    
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required'
        });
    }
    
    if (apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key'
        });
    }
    
    // API key is valid, proceed
    next();
};

module.exports = validateApiKey;