const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const adminRoutes =require("./routes/admin")
const addVehicle =require("./routes/vehicleAdd")
require('dotenv').config();

// Import User model
const User = require('./models/User');


const app = express();
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true, // This is crucial for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Testing route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easywheels';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// JWT secret key (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to set auth cookies
const setAuthCookies = (res, token, email) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.cookie('token', token, cookieOptions);
  res.cookie('email', email, cookieOptions);
};

// Auth Routes

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token with user ID
    const token = generateToken(newUser._id);

    // Set auth cookies
    setAuthCookies(res, token, email);

    // Return user data (without password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token, // Still return token for localStorage compatibility
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with user ID
    const token = generateToken(user._id);

    // Set auth cookies
    setAuthCookies(res, token, email);

    // Return user data and token
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token, // Still return token for localStorage compatibility
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth route
app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email, googleId, imgUrl } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        if (imgUrl) user.imgUrl = imgUrl;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        imgUrl,
        isGoogleUser: true,
      });
      await user.save();
    }

    // Generate JWT token with user ID
    const token = generateToken(user._id);

    // Set auth cookies
    setAuthCookies(res, token, email);

    res.json({
      message: 'Google authentication successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imgUrl: user.imgUrl,
        createdAt: user.createdAt,
      },
      token, // Still return token for localStorage compatibility
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT token (supports both cookies and headers)
const authenticateToken = (req, res, next) => {
  // First try to get token from cookies
  let token = req.cookies.token;
  
  // If no cookie token, try Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Protected route to get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imgUrl: user.imgUrl,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check authentication status
app.get('/api/auth/check', authenticateToken, (req, res) => {
  res.json({ 
    authenticated: true, 
    email: req.cookies.email || null 
  });
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('email');
  res.json({ message: 'Logged out successfully' });
});



//Admin login route  logic setup
app.use('/admin',adminRoutes);

app.use("/api", addVehicle);

//Update vehicle detail or change status 
const updateVehicle = require ("./routes/updateVehicle");
app.use("/api", updateVehicle);


//Data fetching for frontend display
const fetchVehicle =require("./routes/fetchvehicle");
app.use("/api/vehicles", fetchVehicle);


const fetchUsers = require("./routes/fetchuser");
app.use("/api/fetch/users", fetchUsers);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});