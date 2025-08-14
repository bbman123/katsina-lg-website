cat > create-files.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📁 Creating all project files...\n');

// Server.js content
const serverContent = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const publicRoutes = require('./routes/public');

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api', publicRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Katsina LG API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/api/health\`);
});`;

// Database config
const databaseContent = `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;`;

// User model
const userModelContent = `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'editor'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);`;

// Opportunity model
const opportunityModelContent = `const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grant', 'Training', 'Loan', 'Employment', 'Other']
  },
  amount: String,
  duration: String,
  deadline: {
    type: Date,
    required: true
  },
  requirements: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming_soon', 'expired'],
    default: 'active'
  },
  applicants: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);`;

// Auth middleware
const authMiddlewareContent = `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

module.exports = { auth, adminOnly };`;

// Auth controller
const authControllerContent = `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'editor'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { register, login };`;

// Create Admin script
const createAdminContent = `require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@katsinalg.gov.ng' });
    
    if (adminExists) {
      console.log('❌ Admin user already exists!');
      process.exit(1);
    }
    
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@katsinalg.gov.ng',
      password: 'admin123456',
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@katsinalg.gov.ng');
    console.log('Password: admin123456');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();`;

// Auth routes
const authRoutesContent = `const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;`;

// Opportunity routes
const opportunityRoutesContent = `const express = require('express');
const Opportunity = require('../models/Opportunity');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all opportunities (public)
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: 'active' })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create opportunity (protected)
router.post('/', auth, async (req, res) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;`;

// Public routes
const publicRoutesContent = `const express = require('express');
const Opportunity = require('../models/Opportunity');

const router = express.Router();

router.get('/public-data', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ 
      status: 'active',
      deadline: { $gte: new Date() }
    })
    .select('title description category deadline amount duration applicants requirements')
    .sort({ createdAt: -1 })
    .limit(20);

    const media = []; // Placeholder for media data

    res.json({
      success: true,
      data: {
        opportunities,
        media
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;`;

// Create all backend files
const backendFiles = {
    'server.js': serverContent,
    'config/database.js': databaseContent,
    'models/User.js': userModelContent,
    'models/Opportunity.js': opportunityModelContent,
    'middleware/auth.js': authMiddlewareContent,
    'controllers/authController.js': authControllerContent,
    'routes/auth.js': authRoutesContent,
    'routes/opportunities.js': opportunityRoutesContent,
    'routes/public.js': publicRoutesContent,
    'scripts/createAdmin.js': createAdminContent
};

console.log('🔧 Creating backend files...');
Object.entries(backendFiles).forEach(([filename, content]) => {
    const filepath = path.join('backend', filename);
    const dir = path.dirname(filepath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, content);
    console.log(`   Created: backend/${filename}`);
});

// Frontend files
const frontendFiles = {
    'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`,

    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'katsina-green': {
          DEFAULT: '#087443',
          600: '#087443',
          700: '#065a35'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}`,

    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Katsina Local Government</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

    'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

    'src/App.jsx': `import React from 'react'
import PublicHome from './pages/PublicHome'

function App() {
  return <PublicHome />
}

export default App`,

    'src/styles/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { font-family: 'Inter', sans-serif; }

.app-hero {
  min-height: 100vh;
  background: linear-gradient(180deg, #087443 0%, #0fa968 100%);
  color: white;
}

.flag-strip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #00732f 33.33%, #ffffff 33.33%, #ffffff 66.66%, #00732f 66.66%);
  z-index: 50;
}

.header-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 28px;
}

.container-public { 
  max-width: 1100px; 
  margin: 0 auto; 
  padding: 2rem; 
}`,

    'src/pages/PublicHome.jsx': `import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

const Header = () => (
  <header className="relative">
    <div className="flag-strip" aria-hidden="true"></div>
    <div className="header-centered">
      <img src="/logo.png" alt="Katsina LG" className="w-32 h-auto" />
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Katsina Local Government</h1>
        <p className="text-xl opacity-95">Home of Hospitality</p>
      </div>
    </div>
  </header>
)

export default function PublicHome() {
  const [opportunities, setOpportunities] = useState([])

  useEffect(() => {
    // Fetch opportunities from API
    fetch('http://localhost:5000/api/public-data')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOpportunities(data.data.opportunities || [])
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="app-hero">
      <div className="container-public">
        <Header />

        <main className="mt-16 text-white">
          <section className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Building a Stronger Katsina Community
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Together We Progress, Together We Prosper
            </p>
            <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Explore Opportunities
            </button>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Latest Opportunities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.slice(0, 6).map(opp => (
                <article key={opp._id} className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h3 className="font-semibold text-white mb-2">{opp.title}</h3>
                  <p className="text-sm text-white/80 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Deadline: {new Date(opp.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-white/90 mb-4">{opp.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/70">
                      <Users className="w-4 h-4 inline mr-1" />
                      {opp.applicants || 0} applicants
                    </span>
                    <button className="px-3 py-1 bg-white text-green-700 rounded hover:bg-gray-100">
                      Apply
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Phone</h3>
                <p>+234 123 456 7890</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Email</h3>
                <p>info@katsinalg.gov.ng</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Address</h3>
                <p>Local Government Secretariat<br />Katsina, Katsina State</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}`
};

console.log('🎨 Creating frontend files...');
Object.entries(frontendFiles).forEach(([filename, content]) => {
    const filepath = path.join('frontend', filename);
    const dir = path.dirname(filepath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, content);
    console.log(`   Created: frontend/${filename}`);
});

console.log('\n✅ All files created successfully!');
console.log('\n📝 Next steps:');
console.log('1. npm run install-all');
console.log('2. cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env');
console.log('3. Update backend/.env with your MongoDB and Cloudinary credentials');
console.log('4. npm run create-admin');
console.log('5. npm run dev');
EOF