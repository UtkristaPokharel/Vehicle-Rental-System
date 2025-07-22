const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

const { vehicleUpload } = require('../middleware/upload');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

// Helper function to process vehicle image URLs
const processVehicleImageUrl = (vehicle) => {
  if (vehicle.image && !vehicle.image.startsWith('http')) {
    vehicle.image = `${BASE_URL}/uploads/vehicles/${vehicle.image}`;
  }
  return vehicle;
};

router.post('/add-vehicle', vehicleUpload.single('vehicleImage'), async (req, res) => {
  try {
    const { name, type, brand, price, location, features, description, capacity, fuelType, mileage, transmission, isActive, createdById } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: 'Vehicle image is required' });
    }

    const vehicle = new Vehicle({
      name,
      type,
      brand,
      price: parseFloat(price),
      location,
      capacity: parseInt(capacity),
      fuelType,
      mileage: parseFloat(mileage),
      transmission,
      features: JSON.parse(features),
      image,
      description,
      isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
      clickCount: 0, 
      createdBy: req.body.createdBy || 'admin',
      createdById: createdById || 'admin',
    });

    await vehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully' });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Route to track vehicle clicks
router.post('/track-click/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { $inc: { clickCount: 1 } }, // Increment click count by 1
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ 
      message: 'Click tracked successfully', 
      clickCount: vehicle.clickCount 
    });
  } catch (error) {
    console.error('Error tracking click:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Route to get most clicked vehicles (for content-based filtering)
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const popularVehicles = await Vehicle.find({ isActive: true })
      .sort({ clickCount: -1 }) // Sort by click count in descending order
      .limit(limit);

    const processedVehicles = popularVehicles.map(vehicle => processVehicleImageUrl(vehicle.toObject()));
    res.status(200).json(processedVehicles);
  } catch (error) {
    console.error('Error fetching popular vehicles:', error.message);
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;