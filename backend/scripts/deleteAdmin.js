
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const deleteAdmin = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        if (process.env.MONGODB_URI.includes('mongodb+srv')) {
            options.tls = true;
            options.tlsAllowInvalidCertificates = true;
        }

        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('✅ Connected to MongoDB');

        const result = await User.deleteOne({ email: 'admin@katsinalg.gov.ng' });

        if (result.deletedCount > 0) {
            console.log('🗑️  Admin user deleted successfully');
            console.log('💡 Now you can run: npm run create-admin');
        } else {
            console.log('❌ No admin user found to delete');
        }

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error deleting admin:', error.message);
        process.exit(1);
    }
};

deleteAdmin();
