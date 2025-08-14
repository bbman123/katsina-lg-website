
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB connection...');
    console.log(`📍 URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    // Only add TLS options for Atlas
    if (process.env.MONGODB_URI.includes('mongodb+srv')) {
      options.tls = true;
      options.tlsAllowInvalidCertificates = true;
    }

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB connection successful!');

    // Test a simple operation
    const collections = await mongoose.connection.db.collections();
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📁 Collections: ${collections.length}`);

    await mongoose.connection.close();
    console.log('👋 Connection closed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 DNS Error - Check your internet connection');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('💡 SSL/TLS Error - Try local MongoDB instead');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Auth Error - Check your MongoDB credentials');
    }

    process.exit(1);
  }
};

testConnection();
