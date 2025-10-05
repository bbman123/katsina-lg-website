const validateApiKey = (req, res, next) => {
    // Get API key from header or query parameter
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const validApiKey = process.env.API_KEY;
    
    // List of endpoints that don't require API key
    const publicPaths = [
        '/health',
        '/test',
        '/auth/login',
        '/auth/me'        // ADD THIS - allow auth/me with just Bearer token
    ];
    
    // Check if current path is public
    const isPublicPath = publicPaths.some(path => 
        req.path === path || 
        req.path.startsWith(path + '/') ||
        req.originalUrl.includes(path)
    );
    
    // If it's a protected auth route and has Bearer token, allow it
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return next();
    }
    
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