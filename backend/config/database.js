
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        // Add SSL configuration based on environment
        if (process.env.MONGODB_URI.includes('mongodb+srv')) {
            // For MongoDB Atlas - SSL is required
            options.ssl = true;
            options.sslValidate = false; // Allow self-signed certificates
        } else {
            // For local MongoDB - no SSL
            options.ssl = false;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Listen for connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ Database connection error:', error.message);

        // Provide helpful error messages
        if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.log('💡 SSL/TLS Error Fix:');
            console.log('   1. Check if you are using the correct MongoDB URI');
            console.log('   2. For local MongoDB, ensure SSL is disabled');
            console.log('   3. For MongoDB Atlas, ensure SSL is enabled');
            console.log('   4. Try updating your connection string');
        }

        process.exit(1);
    }
};

module.exports = connectDB;
