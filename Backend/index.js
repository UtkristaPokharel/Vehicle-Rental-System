const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require('nodemailer');
const adminRoutes = require("./routes/admin");
const addVehicle = require("./routes/vehicleAdd");
require("dotenv").config();
const {sendLoginEmail , sendSignupEmail} =require("./services/emailService");
const User = require("./models/User");

const app = express();
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true, // This is crucial for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Testing route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/easywheels";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// JWT secret key (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Helper function to set auth cookies
const setAuthCookies = (res, token, email) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("token", token, cookieOptions);
  res.cookie("email", email, cookieOptions);
};

// Auth Routes

// Signup route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
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
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token, // Still return token for localStorage compatibility
    });

    try{
      await sendSignupEmail(email, name); 
      console.log("Signup email sent successfully");
    } catch(e) {
      console.error("Error sending signup email:", e.message);
    }
   
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with user ID
    const token = generateToken(user._id);

    // Set auth cookies
    setAuthCookies(res, token, email);

    // Return user data and token
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token, // Still return token for localStorage compatibility
    });

    try{
         await sendLoginEmail(email,name); 
      console.log("Login email sent successfully");
     } catch(e) {
      console.error("Error sending login email:", e.message);
     }

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth route
app.post("/api/auth/google", async (req, res) => {
  try {
    const { name, email, googleId, imgUrl } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
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
      message: "Google authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imgUrl: user.imgUrl,
        createdAt: user.createdAt,
      },
      token, // Still return token for localStorage compatibility
    });
      try{
         await sendLoginEmail(email,name); 
      console.log("Login email sent successfully");
     } catch(e) {
      console.error("Error sending login email:", e.message);
     }


  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Server error" });

  }finally{
    
  }

});

// Middleware to verify JWT token (supports both cookies and headers)
const authenticateToken = (req, res, next) => {
  // First try to get token from cookies
  let token = req.cookies.token;

  // If no cookie token, try Authorization header
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// Protected route to get current user profile
app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imgUrl: user.imgUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check authentication status
app.get("/api/auth/check", authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    email: req.cookies.email || null,
  });
});

// Logout route
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("email");
  res.json({ message: "Logged out successfully" });
});

//Admin login route  logic setup
app.use("/admin", adminRoutes);

//Adding vehicle
const authMiddleware = require("./middleware/auth");
const { isAdmin } = require("./middleware/auth");

app.use("/api/user", authMiddleware, addVehicle);

app.use("/api/admin", authMiddleware, isAdmin, addVehicle);

//Update vehicle detail or change status
const updateVehicle = require("./routes/updateVehicle");
app.use("/api", updateVehicle);

//Data fetching for frontend display
const fetchVehicle = require("./routes/fetchvehicle");
app.use("/api/vehicles", fetchVehicle);

// Public routes for click tracking (no authentication required)
app.use("/api/public", addVehicle);

const fetchUsers = require("./routes/fetchuser");
app.use("/api/fetch/users", fetchUsers);

// Email configuration - Zoho Mail SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com', // Zoho SMTP server
  port: 587, // Zoho SMTP port
  secure: false, // false for TLS
  auth: {
    user: process.env.EMAIL_USER, // Your Zoho email address
    pass: process.env.EMAIL_PASS  // Your Zoho email password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, address, phone, message, country } = req.body;

    // Validate required fields
    if (!name || !email || !address || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, address, and message are required' 
      });
    }

    // Email content for the user (confirmation email)
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
          <h1>Thank you for contacting EasyWheels!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Your Message Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Address:</strong> ${address}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${message}
            </div>
          </div>
          
          <p>Our team will review your inquiry and respond within 24-48 hours.</p>
          
          <div style="margin-top: 30px;">
            <h4 style="color: #1e40af;">Contact Information:</h4>
            <p>📍 Butwal, Rupandehi, Nepal</p>
            <p>📞 +977 71537999</p>
            <p>📱 +977 9806418493</p>
            <p>✉️ info@easywheels.com.np</p>
          </div>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>EasyWheels Team</strong></p>
        </div>
        <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>© 2024 EasyWheels. All rights reserved.</p>
        </div>
      </div>
    `;

    // Email content for admin notification
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>New Contact Form Submission</h1>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>A new contact form has been submitted on the EasyWheels website.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Customer Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Address:</strong> ${address}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            
            <h4 style="color: #dc2626; margin-top: 20px;">Message:</h4>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${message}
            </div>
          </div>
          
          <p style="color: #dc2626; font-weight: bold;">Please respond to this inquiry promptly.</p>
        </div>
      </div>
    `;

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Thank you for contacting EasyWheels - We received your message',
      html: userEmailContent
    };

    // Send notification email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'info@easywheels.com.np',
      subject: `New Contact Form Submission from ${name}`,
      html: adminEmailContent
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We have sent a confirmation email and will get back to you soon.'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
