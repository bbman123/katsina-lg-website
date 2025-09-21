
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');

        // Modern MongoDB connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        // Handle TLS/SSL based on connection string (using modern options)
        if (process.env.MONGODB_URI.includes('mongodb+srv')) {
            // For MongoDB Atlas - use modern TLS options
            options.tls = true;
            options.tlsAllowInvalidCertificates = true;
            options.tlsAllowInvalidHostnames = true;
        } else {
            // For local MongoDB - no TLS
            options.tls = false;
        }

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@katsinalg.kt.gov.ng' });

        if (adminExists) {
            console.log('❌ Admin user already exists!');
            console.log('📧 Email: admin@katsinalg.kt.gov.ng');

            // Show existing user info
            console.log('👤 Existing user details:');
            console.log(`   Name: ${adminExists.name}`);
            console.log(`   Role: ${adminExists.role}`);
            console.log(`   Created: ${adminExists.createdAt}`);

            console.log('💡 To recreate admin user:');
            console.log('   1. Delete existing: npm run delete-admin');
            console.log('   2. Or try login with existing credentials');

            await mongoose.connection.close();
            process.exit(1);
        }

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name: 'System Administrator',
            email: 'admin@katsinalg.kt.gov.ng',
            password: 'admin123456',
            role: 'admin'
        });

        console.log('🎉 Admin user created successfully!');
        console.log('┌─────────────────────────────────────┐');
        console.log('│           LOGIN CREDENTIALS         │');
        console.log('├─────────────────────────────────────┤');
        console.log('│ Email:    admin@katsinalg.kt.gov.ng    │');
        console.log('│ Password: admin123456               │');
        console.log('│ Role:     admin                     │');
        console.log('└─────────────────────────────────────┘');
        console.log('🌐 Login URL: http://localhost:3000/ktlgmaster');
        console.log('⚠️  IMPORTANT: Change password after first login!');

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);

        if (error.code === 11000) {
            console.log('👤 Admin user already exists with this email');
        } else if (error.message.includes('SSL') || error.message.includes('TLS') || error.message.includes('ENOTFOUND')) {
            console.log('💡 Connection Error - Let\'s try local MongoDB instead');
            console.log('   Run: npm run setup-local-db');
        }

        await mongoose.connection.close();
        process.exit(1);
    }
};

createAdmin();
