const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle.js'); // adjust path if needed

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

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const processedVehicles = vehicles.map(vehicle => processVehicleImageUrl(vehicle.toObject()));
    res.json(processedVehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET vehicles by type
router.get('/type/:type', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ type: req.params.type });
    const processedVehicles = vehicles.map(vehicle => processVehicleImageUrl(vehicle.toObject()));
    res.json(processedVehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    const processedVehicle = processVehicleImageUrl(vehicle.toObject());
    res.json(processedVehicle);
  } catch (err) {
    console.error('Error fetching vehicle:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;