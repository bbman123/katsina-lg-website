
require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');

const setupLocalDB = async () => {
    console.log('🔧 Setting up local MongoDB...');

    // Check if MongoDB is installed
    exec('mongod --version', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ MongoDB not found. Installing...');
            console.log('🔧 Run these commands:');
            console.log('   brew tap mongodb/brew');
            console.log('   brew install mongodb-community@7.0');
            console.log('   brew services start mongodb/brew/mongodb-community@7.0');
            return;
        }

        console.log('✅ MongoDB found:', stdout.split('\n')[0]);

        // Start MongoDB service
        exec('brew services start mongodb/brew/mongodb-community@7.0', (error, stdout, stderr) => {
            if (error) {
                console.log('⚠️  Could not start MongoDB service automatically');
                console.log('🔧 Please run: brew services start mongodb/brew/mongodb-community@7.0');
            } else {
                console.log('✅ MongoDB service started');
            }

            // Update .env file
            const envContent = `# Server Configuration
PORT=5001
NODE_ENV=development

# Database - Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/katsina-lg

# JWT Secret
JWT_SECRET=katsina-lg-super-secret-jwt-key-2024-secure-random-string
JWT_EXPIRE=30d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
CLIENT_URL=http://localhost:3000`;

            fs.writeFileSync('.env', envContent);
            console.log('✅ Updated .env file for local MongoDB');
            console.log('🎉 Setup complete! Now run: npm run create-admin');
        });
    });
};

setupLocalDB();
