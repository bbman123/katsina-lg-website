const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const setupCronJobs = require('./utils/cronJobs');
const validateApiKey = require('./middleware/apiKey'); // ADD THIS LINE
require('dotenv').config();

// Define PORT at the beginning
const PORT = process.env.PORT || 5001;

// Import routes
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const publicRoutes = require('./routes/public');
const mediaRoutes = require('./routes/media');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ADD API KEY VALIDATION HERE (before routes but after body parser)
app.use('/api', validateApiKey);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route (moved before other routes)
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Katsina LG API is running',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api', publicRoutes);
app.use('/api/media', mediaRoutes);

// Debug routes (add BEFORE the 404 handler)
if (process.env.NODE_ENV !== 'production') {
  try {
    const debugRoutes = require('./routes/debug');
    app.use('/api/debug', debugRoutes);
    console.log('Debug routes enabled at /api/debug');
  } catch (error) {
    console.log('Debug routes not found, skipping...');
  }
}

// 404 handler (this should be AFTER all your routes)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend should be on: http://localhost:3000`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    // Initialize cron jobs
    if (process.env.NODE_ENV === 'production') {
        setupCronJobs();
    }
});
