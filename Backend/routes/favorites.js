const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/auth');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Helper function to process vehicle image URLs
const processVehicleImageUrl = (vehicle) => {
  if (vehicle.image) {
    // If it's already a full URL (Cloudinary or external), keep it as is
    if (vehicle.image.startsWith('http')) {
      return vehicle;
    }
    // If it's a local filename, construct the local URL
    vehicle.image = `${BASE_URL}/uploads/vehicles/${vehicle.image}`;
  }
  return vehicle;
};

// POST: Add vehicle to favorites
router.post('/add/:vehicleId', authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    // Get user ID from either user or admin
    const userId = req.user?.id || req.admin?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User identification failed' });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if already in favorites
    const user = await User.findById(userId);
    if (user.favorites.includes(vehicleId)) {
      return res.status(400).json({ message: 'Vehicle already in favorites' });
    }

    // Add to favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: vehicleId } },
      { new: true }
    );

    res.status(200).json({ 
      message: 'Vehicle added to favorites',
      isFavorite: true 
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE: Remove vehicle from favorites
router.delete('/remove/:vehicleId', authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    // Get user ID from either user or admin
    const userId = req.user?.id || req.admin?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User identification failed' });
    }

    // Remove from favorites
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: vehicleId } },
      { new: true }
    );

    res.status(200).json({ 
      message: 'Vehicle removed from favorites',
      isFavorite: false 
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Get user's favorite vehicles
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get user ID from either user or admin
    const userId = req.user?.id || req.admin?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User identification failed' });
    }

    const user = await User.findById(userId).populate({
      path: 'favorites',
      match: { isActive: true }, // Only get active vehicles
      select: 'name type brand price location image description dateRange clickCount'
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process vehicle image URLs
    const processedFavorites = user.favorites.map(vehicle => 
      processVehicleImageUrl(vehicle.toObject())
    );

    res.status(200).json(processedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Check if vehicle is in user's favorites
router.get('/check/:vehicleId', authMiddleware, async (req, res) => {
  try {
    const { vehicleId } = req.params;
    // Get user ID from either user or admin
    const userId = req.user?.id || req.admin?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User identification failed' });
    }

    const user = await User.findById(userId).select('favorites');
    const isFavorite = user.favorites.includes(vehicleId);

    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
