
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Katsina Local Government Project...\n');

// Create directory structure
const directories = [
    'backend',
    'backend/config',
    'backend/controllers',
    'backend/middleware',
    'backend/models',
    'backend/routes',
    'backend/uploads',
    'backend/scripts',
    'frontend',
    'frontend/public',
    'frontend/src',
    'frontend/src/components',
    'frontend/src/components/admin',
    'frontend/src/components/layout',
    'frontend/src/components/common',
    'frontend/src/pages',
    'frontend/src/services',
    'frontend/src/styles'
];

console.log('📁 Creating directory structure...');
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   Created: ${dir}`);
    }
});

// Backend package.json
const backendPackage = {
    "name": "katsina-lg-backend",
    "version": "1.0.0",
    "description": "Katsina Local Government Backend API",
    "main": "server.js",
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": ["government", "local-government", "nigeria", "api"],
    "author": "Katsina LG Team",
    "license": "MIT",
    "dependencies": {
        "express": "^4.18.2",
        "mongoose": "^7.5.0",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2",
        "multer": "^1.4.5",
        "cloudinary": "^1.40.0",
        "express-fileupload": "^1.4.0",
        "socket.io": "^4.7.2",
        "express-validator": "^7.0.1",
        "helmet": "^7.0.0",
        "express-rate-limit": "^6.8.1"
    },
    "devDependencies": {
        "nodemon": "^3.0.1",
        "concurrently": "^8.2.0"
    }
};

// Frontend package.json
const frontendPackage = {
    "name": "katsina-lg-frontend",
    "version": "1.0.0",
    "description": "Katsina Local Government Frontend",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.15.0",
        "axios": "^1.5.0",
        "lucide-react": "^0.263.1",
        "date-fns": "^2.30.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.3",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.27",
        "tailwindcss": "^3.3.0",
        "vite": "^4.4.5"
    }
};

console.log('📄 Creating package.json files...');
fs.writeFileSync('backend/package.json', JSON.stringify(backendPackage, null, 2));
fs.writeFileSync('frontend/package.json', JSON.stringify(frontendPackage, null, 2));

// Create .env.example files
const backendEnv = `# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/katsina-lg
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/katsina-lg

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
CLIENT_URL=http://localhost:3000`;

const frontendEnv = `VITE_API_BASE_URL=http://localhost:5001/api
VITE_POLL_INTERVAL_MS=8000
VITE_APP_NAME=Katsina Local Government`;

console.log('🔧 Creating environment files...');
fs.writeFileSync('backend/.env.example', backendEnv);
fs.writeFileSync('frontend/.env.example', frontendEnv);

// Create .gitignore files
const gitignore = `node_modules/
.env
.env.local
*.log
.DS_Store
dist/
build/
coverage/`;

fs.writeFileSync('.gitignore', gitignore);
fs.writeFileSync('backend/.gitignore', gitignore + '\nuploads/');
fs.writeFileSync('frontend/.gitignore', gitignore);

console.log('✅ Project structure created successfully!');

console.log('\n🎉 Setup completed!');
console.log('\n📝 Next steps:');
console.log('1. Run: node create-files.js');
console.log('2. Run: npm run install-all');
console.log('3. Copy environment files and update credentials');
console.log('4. Run: npm run create-admin');
console.log('5. Run: npm run dev');
