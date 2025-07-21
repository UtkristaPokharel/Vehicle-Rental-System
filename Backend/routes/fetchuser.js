const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path
const verifyToken = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const { profileUpload } = require('../middleware/upload');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Debug route to test token
router.get('/test-auth', verifyToken, (req, res) => {
  res.json({ 
    message: 'Token is valid',
    admin: req.admin,
    user: req.user,
    hasAdmin: !!req.admin,
    hasUser: !!req.user
  });
});

// GET all users
router.get('/', async (req, res) => {
  try { 
    const users = await User.find(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/delete-user/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user profile (name, email, password) - REST style
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user?.id || req.admin?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) update.password = password; // In production, hash the password
    
    const updated = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Update user profile (name, password) - Legacy route for backward compatibility
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, password } = req.body;
    const userId = req.user?.id || req.admin?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const update = {};
    if (name) update.name = name;
    if (password) update.password = password; // Hashing should be added in production
    const updated = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// GET user profile (with correct image URL)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    let imgUrl = user.imgUrl;
    if (imgUrl && !imgUrl.startsWith('http')) {
      imgUrl = `${BASE_URL}/uploads/profiles/${imgUrl}`;
    }
    res.json({
      ...user.toObject(),
      imgUrl,
      licenseFront: user.licenseFront ? `${BASE_URL}/uploads/profiles/${user.licenseFront}` : null,
      licenseBack: user.licenseBack ? `${BASE_URL}/uploads/profiles/${user.licenseBack}` : null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Upload profile image - Updated to match frontend expectations
router.post('/upload-profile', verifyToken, profileUpload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const updated = await User.findByIdAndUpdate(userId, { imgUrl: req.file.filename }, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    
    const fullImageUrl = `${BASE_URL}/uploads/profiles/${req.file.filename}`;
    res.json({ 
      message: 'Profile image updated successfully', 
      imgUrl: fullImageUrl,
      filename: req.file.filename 
    });
  } catch (err) {
    console.error('Profile image upload error:', err);
    res.status(500).json({ message: 'Error uploading profile image' });
  }
});

// Upload profile image - Legacy route for backward compatibility
router.post('/upload-profile-image', verifyToken, profileUpload.single('profileImg'), async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const updated = await User.findByIdAndUpdate(userId, { imgUrl: req.file.filename }, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile image updated', imgUrl: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile image' });
  }
});

// Upload license images (front/back)
router.post('/upload-license', verifyToken, profileUpload.fields([
  { name: 'licenseFront', maxCount: 1 },
  { name: 'licenseBack', maxCount: 1 },
]), async (req, res) => {
  try {
    const userId = req.user?.id || req.admin?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const update = {};
    if (req.files.licenseFront) update.licenseFront = req.files.licenseFront[0].filename;
    if (req.files.licenseBack) update.licenseBack = req.files.licenseBack[0].filename;
    
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No license images uploaded' });
    }
    
    const updated = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      message: 'License images updated successfully', 
      user: updated,
      uploadedFiles: {
        licenseFront: req.files.licenseFront ? `${BASE_URL}/uploads/profiles/${req.files.licenseFront[0].filename}` : null,
        licenseBack: req.files.licenseBack ? `${BASE_URL}/uploads/profiles/${req.files.licenseBack[0].filename}` : null
      }
    });
  } catch (err) {
    console.error('License upload error:', err);
    res.status(500).json({ message: 'Error uploading license images' });
  }
});

// Admin route to verify/unverify user
router.patch('/verify/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body; // true or false
    const adminName = req.admin?.name || req.user?.name || 'Admin';

    const updateData = {
      isVerified: verified,
      verifiedAt: verified ? new Date() : null,
      verifiedBy: verified ? adminName : null,
    };

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: `User ${verified ? 'verified' : 'unverified'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt,
        verifiedBy: user.verifiedBy
      }
    });
  } catch (err) {
    console.error('Verify user error:', err);
    res.status(500).json({ message: 'Error updating verification status' });
  }
});

module.exports = router;
